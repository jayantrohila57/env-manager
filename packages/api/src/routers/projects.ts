import { db } from "@env-manager/db";
import { environment, project } from "@env-manager/db/schema/projects";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod/v3";
import { protectedProcedure, router } from "../index";
import {
  createProjectInput,
  getProjectInput,
  makeResponseSchema,
  projectOutput,
  respond,
  updateProjectInput,
} from "../validation";

export const projectsRouter = router({
  // List all projects for the authenticated user
  list: protectedProcedure
    .output(makeResponseSchema(z.array(projectOutput)))
    .query(async ({ ctx }) => {
      const projectsList = await db
        .select()
        .from(project)
        .where(eq(project.userId, ctx.session.user.id))
        .orderBy(project.updatedAt);

      return respond({ message: "Projects fetched", data: projectsList });
    }),

  // Get a single project with its environments
  get: protectedProcedure
    .input(getProjectInput)
    .output(
      makeResponseSchema(
        z.object({
          project: projectOutput.nullable(),
          environments: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              projectId: z.string(),
              createdAt: z.date(),
              updatedAt: z.date(),
            }),
          ),
        }),
      ),
    )
    .query(async ({ ctx, input }) => {
      const projectData = await db
        .select({
          id: project.id,
          name: project.name,
          description: project.description,
          userId: project.userId,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        })
        .from(project)
        .where(
          and(
            eq(project.id, input.id),
            eq(project.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      const environmentsList = await db
        .select({
          id: environment.id,
          name: environment.name,
          projectId: environment.projectId,
          createdAt: environment.createdAt,
          updatedAt: environment.updatedAt,
        })
        .from(environment)
        .where(eq(environment.projectId, input.id))
        .orderBy(environment.name);

      const projectRecord = projectData[0];

      return respond({
        message: "Project fetched",
        data: {
          project: projectRecord ?? null,
          environments: projectRecord ? environmentsList : [],
        },
      });
    }),

  // Create a new project
  create: protectedProcedure
    .input(createProjectInput)
    .output(makeResponseSchema(projectOutput))
    .mutation(async ({ ctx, input }) => {
      const newProject = await db
        .insert(project)
        .values({
          id: crypto.randomUUID(),
          name: input.name,
          description: input.description,
          userId: ctx.session.user.id,
        })
        .returning();

      if (!newProject[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create project",
        });
      }

      return respond({ message: "Project created", data: newProject[0] });
    }),

  // Update a project
  update: protectedProcedure
    .input(updateProjectInput)
    .output(makeResponseSchema(projectOutput))
    .mutation(async ({ ctx, input }) => {
      const existingProject = await db
        .select()
        .from(project)
        .where(
          and(
            eq(project.id, input.id),
            eq(project.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      if (existingProject.length === 0) {
        throw new Error("Project not found");
      }

      const updateData: Record<string, unknown> = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined)
        updateData.description = input.description;

      const updatedProject = await db
        .update(project)
        .set(updateData)
        .where(eq(project.id, input.id))
        .returning();

      if (!updatedProject[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update project",
        });
      }

      return respond({ message: "Project updated", data: updatedProject[0] });
    }),

  // Delete a project (and all its environments and variables)
  delete: protectedProcedure
    .input(getProjectInput)
    .output(makeResponseSchema(z.object({ success: z.boolean() })))
    .mutation(async ({ ctx, input }) => {
      const existingProject = await db
        .select()
        .from(project)
        .where(
          and(
            eq(project.id, input.id),
            eq(project.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      if (existingProject.length === 0) {
        throw new Error("Project not found");
      }

      await db.delete(project).where(eq(project.id, input.id));

      return respond({ message: "Project deleted", data: { success: true } });
    }),
});
