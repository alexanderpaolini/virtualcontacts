import type { CardPropertyType } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const cardRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.card.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
      select: {
        id: true,
      },
    });
  }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.card.findFirst({
        where: { id: input.id, ownerId: ctx.session.user.id },
        select: {
          id: true,
          shareRules: {
            select: {
              id: true,
            },
          },
          properties: {
            select: {
              id: true,
            },
          },
        },
      });
    }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id } = await ctx.db.card.create({
      data: {
        ownerId: ctx.session.user.id,
      },
    });

    return { success: true, data: { id } };
  }),

  addProperty: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        type: z.string(),
        value: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.cardProperty.create({
        data: {
          cardId: input.id,
          type: input.type as CardPropertyType,
          value: input.value,
        },
      });

      return { success: true };
    }),

  getProperties: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.cardProperty.findMany({
        where: {
          cardId: input.id,
        },
        select: {
          id: true,
          cardId: true,
          type: true,
          value: true,
          createdAt: true,
          updatedAt: true,
          parameters: true,
        },
        orderBy: [{ type: "asc" }, { value: "asc" }],
      });
    }),

  addShareRule: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.shareRule.create({
        data: {
          cardId: input.id,
          name: input.name,
        },
      });

      return { success: true };
    }),
});
