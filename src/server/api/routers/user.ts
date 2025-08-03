import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findFirst({ where: { id: ctx.session.user.id } });
  }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.user.findFirst({
        where: {
          id: input.id,
        },
      });
    }),

  updateMe: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          email: input.email,
        },
      });

      return { success: true };
    }),
});
