import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import z from "zod";

export const exampleRouter = createTRPCRouter({
  helloWorld: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        message: `Hello, ${input.name ?? "world"}! This is an unprotected route.`,
      };
    }),

  secretHello: protectedProcedure.query(({ ctx }) => {
    return {
      message: `Hello, ${ctx.session.user.email}! This is a protected route.`,
    };
  }),
});
