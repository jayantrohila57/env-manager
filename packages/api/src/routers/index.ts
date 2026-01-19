import { protectedProcedure, publicProcedure, router } from "../index";
import { auditLogsRouter } from "./audit";
import { environmentsRouter } from "./environments";
import { projectsRouter } from "./projects";
import { templatesRouter } from "./templates";
import { environmentVariablesRouter } from "./variables";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  projects: projectsRouter,
  environments: environmentsRouter,
  environmentVariables: environmentVariablesRouter,
  auditLogs: auditLogsRouter,
  templates: templatesRouter,
});
export type AppRouter = typeof appRouter;
