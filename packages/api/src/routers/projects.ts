import { db } from "@env-manager/db";
import { environment, project } from "@env-manager/db/schema/projects";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod/v3";
import { protectedProcedure, router } from "../index";
import {
  changeProjectStatusInput,
  createProjectInput,
  environmentOutput,
  getProjectBySlugInput,
  getProjectInput,
  makeResponseSchema,
  projectOutput,
  respond,
  toggleProjectPublicInput,
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

  // Get a single project with its environments by ID
  get: protectedProcedure
    .input(getProjectInput)
    .output(
      makeResponseSchema(
        z.object({
          project: projectOutput.nullable(),
          environments: z.array(environmentOutput),
        }),
      ),
    )
    .query(async ({ ctx, input }) => {
      const projectData = await db
        .select({
          id: project.id,
          name: project.name,
          slug: project.slug,
          description: project.description,
          isArchived: project.isArchived,
          isPublic: project.isPublic,
          repositoryUrl: project.repositoryUrl,
          websiteUrl: project.websiteUrl,
          status: project.status,
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
          slug: environment.slug,
          branch: environment.branch,
          deployedUrl: environment.deployedUrl,
          status: environment.status,
          isProduction: environment.isProduction,
          description: environment.description,
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
          project: projectRecord || null,
          environments: projectRecord ? environmentsList : [],
        },
      });
    }),

  // Get a single project with its environments by slug
  getBySlug: protectedProcedure
    .input(getProjectBySlugInput)
    .output(
      makeResponseSchema(
        z.object({
          project: projectOutput.nullable(),
          environments: z.array(environmentOutput),
        }),
      ),
    )
    .query(async ({ ctx, input }) => {
      const projectData = await db
        .select({
          id: project.id,
          name: project.name,
          slug: project.slug,
          description: project.description,
          isArchived: project.isArchived,
          isPublic: project.isPublic,
          repositoryUrl: project.repositoryUrl,
          websiteUrl: project.websiteUrl,
          status: project.status,
          userId: project.userId,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        })
        .from(project)
        .where(
          and(
            eq(project.slug, input.slug),
            eq(project.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      if (projectData.length === 0) {
        return respond({
          message: "Project not found",
          data: {
            project: null,
            environments: [],
          },
        });
      }

      const environmentsList = await db
        .select({
          id: environment.id,
          name: environment.name,
          slug: environment.slug,
          branch: environment.branch,
          deployedUrl: environment.deployedUrl,
          status: environment.status,
          isProduction: environment.isProduction,
          description: environment.description,
          projectId: environment.projectId,
          createdAt: environment.createdAt,
          updatedAt: environment.updatedAt,
        })
        .from(environment)
        .where(eq(environment.projectId, projectData[0]?.id || ""))
        .orderBy(environment.name);

      return respond({
        message: "Project fetched",
        data: {
          project: projectData[0] || null,
          environments: environmentsList,
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
          repositoryUrl: input.repositoryUrl || null,
          websiteUrl: input.websiteUrl || null,
          isPublic: input.isPublic,
          slug: input.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
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
      if (input.name !== undefined) {
        updateData.name = input.name;
        updateData.slug = input.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      if (input.description !== undefined)
        updateData.description = input.description;
      if (input.repositoryUrl !== undefined)
        updateData.repositoryUrl = input.repositoryUrl || null;
      if (input.websiteUrl !== undefined)
        updateData.websiteUrl = input.websiteUrl || null;
      if (input.isPublic !== undefined) updateData.isPublic = input.isPublic;

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

  // Archive a project
  archive: protectedProcedure
    .input(getProjectInput)
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

      const archivedProject = await db
        .update(project)
        .set({ isArchived: true })
        .where(eq(project.id, input.id))
        .returning();

      if (!archivedProject[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to archive project",
        });
      }

      return respond({ message: "Project archived", data: archivedProject[0] });
    }),

  // Unarchive a project
  unarchive: protectedProcedure
    .input(getProjectInput)
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

      const unarchivedProject = await db
        .update(project)
        .set({ isArchived: false })
        .where(eq(project.id, input.id))
        .returning();

      if (!unarchivedProject[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to unarchive project",
        });
      }

      return respond({
        message: "Project unarchived",
        data: unarchivedProject[0],
      });
    }),

  // Change project status
  changeStatus: protectedProcedure
    .input(changeProjectStatusInput)
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

      const updatedProject = await db
        .update(project)
        .set({ status: input.status })
        .where(eq(project.id, input.id))
        .returning();

      if (!updatedProject[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to change project status",
        });
      }

      return respond({
        message: "Project status updated",
        data: updatedProject[0],
      });
    }),

  // Toggle project public/private visibility
  togglePublic: protectedProcedure
    .input(toggleProjectPublicInput)
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

      const currentProject = existingProject[0];
      if (!currentProject) {
        throw new Error("Project not found");
      }

      const updatedProject = await db
        .update(project)
        .set({ isPublic: !currentProject.isPublic })
        .where(eq(project.id, input.id))
        .returning();

      if (!updatedProject[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to toggle project visibility",
        });
      }

      return respond({
        message: `Project is now ${updatedProject[0].isPublic ? "public" : "private"}`,
        data: updatedProject[0],
      });
    }),
});
