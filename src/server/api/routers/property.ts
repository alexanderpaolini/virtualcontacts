import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const propertyRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        value: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await ctx.db.cardProperty.update({
        where: { id },
        data,
      });
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.cardProperty.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),
});
