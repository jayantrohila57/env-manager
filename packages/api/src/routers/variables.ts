import { db } from "@env-manager/db";
import {
  environment,
  environmentVariable,
  project,
} from "@env-manager/db/schema/projects";
import { and, eq } from "drizzle-orm";
import { z } from "zod/v3";

import { protectedProcedure, router } from "../index";
import {
  createEnvironmentInput,
  environmentOutput,
  environmentWithVariablesOutput,
  getEnvironmentInput,
  listEnvironmentsInput,
  makeResponseSchema,
  respond,
  updateEnvironmentInput,
} from "../validation";

export const environmentVariablesRouter = router({
  list: protectedProcedure
    .input(listEnvironmentsInput)
    .output(makeResponseSchema(z.array(environmentOutput)))
    .query(async ({ ctx, input }) => {
      const ownsProject = await db
        .select({ id: project.id })
        .from(project)
        .where(
          and(
            eq(project.id, input.projectId),
            eq(project.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      if (!ownsProject.length) {
        return respond({ message: "Project not found", data: [] });
      }

      const environments = await db
        .select()
        .from(environment)
        .where(eq(environment.projectId, input.projectId))
        .orderBy(environment.name);

      return respond({ message: "Environments fetched", data: environments });
    }),

  get: protectedProcedure
    .input(getEnvironmentInput)
    .output(makeResponseSchema(environmentWithVariablesOutput))
    .query(async ({ ctx, input }) => {
      const env = await db
        .select({
          id: environment.id,
          name: environment.name,
          projectId: environment.projectId,
          createdAt: environment.createdAt,
          updatedAt: environment.updatedAt,
        })
        .from(environment)
        .innerJoin(project, eq(environment.projectId, project.id))
        .where(
          and(
            eq(environment.id, input.id),
            eq(project.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      if (!env.length) {
        return respond({
          message: "Environment not found",
          data: { environment: null, variables: [] },
        });
      }

      const variables = await db
        .select({
          id: environmentVariable.id,
          key: environmentVariable.key,
          environmentId: environmentVariable.environmentId,
          createdAt: environmentVariable.createdAt,
          updatedAt: environmentVariable.updatedAt,
        })
        .from(environmentVariable)
        .where(eq(environmentVariable.environmentId, input.id))
        .orderBy(environmentVariable.key);

      const environmentRecord = env[0];

      if (!environmentRecord) {
        return respond({
          message: "Environment not found",
          data: { environment: null, variables: [] },
        });
      }

      return respond({
        message: "Environment fetched",
        data: { environment: environmentRecord, variables },
      });
    }),

  create: protectedProcedure
    .input(createEnvironmentInput)
    .output(makeResponseSchema(environmentOutput.nullable()))
    .mutation(async ({ ctx, input }) => {
      const ownsProject = await db
        .select({ id: project.id })
        .from(project)
        .where(
          and(
            eq(project.id, input.projectId),
            eq(project.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      if (!ownsProject.length) {
        return respond({ message: "Project not found", data: null });
      }

      const [env] = await db
        .insert(environment)
        .values({
          id: crypto.randomUUID(),
          name: input.name,
          projectId: input.projectId,
        })
        .returning();

      if (!env) {
        return respond({ message: "Failed to create environment", data: null });
      }

      return respond({ message: "Environment created", data: env });
    }),

  update: protectedProcedure
    .input(updateEnvironmentInput)
    .output(makeResponseSchema(environmentOutput.nullable()))
    .mutation(async ({ ctx, input }) => {
      const exists = await db
        .select({ id: environment.id })
        .from(environment)
        .innerJoin(project, eq(environment.projectId, project.id))
        .where(
          and(
            eq(environment.id, input.id),
            eq(project.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      if (!exists.length) {
        return respond({ message: "Environment not found", data: null });
      }

      const [updated] = await db
        .update(environment)
        .set({
          ...(input.name && { name: input.name }),
        })
        .where(eq(environment.id, input.id))
        .returning();

      if (!updated) {
        return respond({ message: "Failed to update environment", data: null });
      }

      return respond({ message: "Environment updated", data: updated });
    }),

  delete: protectedProcedure
    .input(getEnvironmentInput)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const exists = await db
        .select({ id: environment.id })
        .from(environment)
        .innerJoin(project, eq(environment.projectId, project.id))
        .where(
          and(
            eq(environment.id, input.id),
            eq(project.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      if (!exists.length) {
        return { success: false };
      }

      await db.delete(environment).where(eq(environment.id, input.id));

      return { success: true };
    }),
});
