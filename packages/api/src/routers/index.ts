import { protectedProcedure, publicProcedure, router } from "../index";
import { environmentsRouter } from "./environments";
import { projectsRouter } from "./projects";
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
});
export type AppRouter = typeof appRouter;
