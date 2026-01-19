import { decrypt, encrypt } from "@env-manager/crypto";
import { db } from "@env-manager/db";
import {
  environment,
  environmentVariable,
  project,
} from "@env-manager/db/schema/projects";
import { template, templateVariable } from "@env-manager/db/schema/templates";
import { TRPCError } from "@trpc/server";
import { and, count, eq } from "drizzle-orm";
import { z } from "zod/v3";
import { createAuditLog, getProjectEnvironmentIds } from "../audit";
import { protectedProcedure, router } from "../index";
import {
  applyTemplateInput,
  createTemplateInput,
  getTemplateInput,
  listTemplatesOutput,
  makeResponseSchema,
  respond,
  templateWithVariablesOutput,
} from "../validation";

export const templatesRouter = router({
  list: protectedProcedure
    .output(makeResponseSchema(z.array(listTemplatesOutput)))
    .query(async ({ ctx }) => {
      const templates = await db
        .select({
          id: template.id,
          name: template.name,
          description: template.description,
          createdAt: template.createdAt,
          updatedAt: template.updatedAt,
          variableCount: count(templateVariable.id).mapWith(Number),
        })
        .from(template)
        .leftJoin(
          templateVariable,
          eq(template.id, templateVariable.templateId),
        )
        .where(eq(template.userId, ctx.session.user.id))
        .groupBy(
          template.id,
          template.name,
          template.description,
          template.createdAt,
          template.updatedAt,
        );

      return respond({ message: "Templates fetched", data: templates });
    }),

  create: protectedProcedure
    .input(createTemplateInput)
    .output(makeResponseSchema(templateWithVariablesOutput))
    .mutation(async ({ ctx, input }) => {
      const [newTemplate] = await db
        .insert(template)
        .values({
          id: crypto.randomUUID(),
          name: input.name,
          description: input.description,
          userId: ctx.session.user.id,
        })
        .returning();

      if (!newTemplate) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create template",
        });
      }

      const variablesToInsert = input.variables.map((v) => ({
        id: crypto.randomUUID(),
        templateId: newTemplate.id,
        key: v.key,
        encryptedValue: encrypt(v.value),
        description: v.description,
      }));

      if (variablesToInsert.length > 0) {
        await db.insert(templateVariable).values(variablesToInsert);
      }

      return respond({
        message: "Template created",
        data: {
          ...newTemplate,
          variables: variablesToInsert.map((v) => ({
            id: v.id,
            key: v.key,
            value: input.variables.find((iv) => iv.key === v.key)?.value || "",
            description: v.description || null,
          })),
        },
      });
    }),

  get: protectedProcedure
    .input(getTemplateInput)
    .output(makeResponseSchema(templateWithVariablesOutput.nullable()))
    .query(async ({ ctx, input }) => {
      const result = await db
        .select({
          template,
          templateVariable,
        })
        .from(template)
        .leftJoin(
          templateVariable,
          eq(template.id, templateVariable.templateId),
        )
        .where(
          and(
            eq(template.id, input.id),
            eq(template.userId, ctx.session.user.id),
          ),
        );

      if (result.length === 0) {
        return respond({ message: "Template not found", data: null });
      }

      const templateData = result[0]?.template;
      // Filter out nulls from left join execution
      const variables = result
        .map((r) => r.templateVariable)
        .filter((v): v is typeof templateVariable.$inferSelect => !!v)
        .map((v) => ({
          id: v.id,
          key: v.key,
          value: decrypt(v.encryptedValue),
          description: v.description,
        }));

      return respond({
        message: "Template fetched",
        data: {
          ...templateData,
          variables,
        },
      });
    }),

  delete: protectedProcedure
    .input(getTemplateInput)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db
        .select()
        .from(template)
        .where(
          and(
            eq(template.id, input.id),
            eq(template.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      if (existing.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template not found",
        });
      }

      await db.delete(template).where(eq(template.id, input.id));
      return { success: true };
    }),

  applyTemplate: protectedProcedure
    .input(applyTemplateInput)
    .output(
      makeResponseSchema(
        z.object({ created: z.number(), skipped: z.number() }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify ownership of target environment
      const hasAccess = await db
        .select({ id: environment.id })
        .from(environment)
        .innerJoin(project, eq(environment.projectId, project.id))
        .where(
          and(
            eq(environment.id, input.environmentId),
            eq(project.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      if (!hasAccess.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Environment not found",
        });
      }

      // Get template vars
      const templateVars = await db
        .select({
          key: templateVariable.key,
          encryptedValue: templateVariable.encryptedValue,
        })
        .from(templateVariable)
        .innerJoin(template, eq(templateVariable.templateId, template.id))
        .where(
          and(
            eq(template.id, input.templateId),
            eq(template.userId, ctx.session.user.id),
          ),
        );

      if (templateVars.length === 0) {
        // Check if template exists first to give better error or just return 0
        const tmpl = await db
          .select()
          .from(template)
          .where(
            and(
              eq(template.id, input.templateId),
              eq(template.userId, ctx.session.user.id),
            ),
          );
        if (tmpl.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Template not found",
          });
        }
        return respond({
          message: "Template has no variables",
          data: { created: 0, skipped: 0 },
        });
      }

      // Get existing vars in environment
      const existingVars = await db
        .select({ key: environmentVariable.key })
        .from(environmentVariable)
        .where(eq(environmentVariable.environmentId, input.environmentId));

      const existingKeys = new Set(existingVars.map((v) => v.key));

      let created = 0;
      let skipped = 0;
      const toInsert: (typeof environmentVariable.$inferInsert)[] = [];

      for (const tv of templateVars) {
        if (existingKeys.has(tv.key)) {
          skipped++;
          continue;
        }

        // Decrypt then re-encrypt to generate new nonce/IV
        const decrypted = decrypt(tv.encryptedValue);
        const encrypted = encrypt(decrypted);

        toInsert.push({
          id: crypto.randomUUID(),
          environmentId: input.environmentId,
          key: tv.key,
          encryptedValue: encrypted,
        });
        created++;
      }

      if (toInsert.length > 0) {
        await db.insert(environmentVariable).values(toInsert);

        // Audit Log
        const envDetails = await getProjectEnvironmentIds(input.environmentId);
        if (envDetails) {
          await createAuditLog({
            userId: ctx.session.user.id,
            projectId: envDetails.projectId,
            environmentId: envDetails.environmentId,
            action: "BULK_IMPORT", // Reusing BULK_IMPORT action type
            entityType: "VARIABLE",
            newValue: JSON.stringify({
              templateId: input.templateId,
              appliedCount: created,
              skippedCount: skipped,
            }),
          });
        }
      }

      return respond({
        message: `Applied template: ${created} created, ${skipped} skipped`,
        data: { created, skipped },
      });
    }),
});
