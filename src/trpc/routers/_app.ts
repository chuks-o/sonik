import { baseProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  health: baseProcedure.query(() => {
    return {
      status: 'ok',
      code: 200
    };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;