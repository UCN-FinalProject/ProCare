import { TRPCError } from "@trpc/server";
import {
  type GetManyHealthConditionsInput,
  type CreateHealthConditionInput,
  type UpdateHealthConditionInput,
} from "./validation/HealthConditionValidation";
import { type TRPCContext } from "../api/trpc";
import { healthCondition } from "../db/export";
import { asc, eq } from "drizzle-orm";

export default {
  async getByID({ id, ctx }: { id: number; ctx: TRPCContext }) {
    const res = await ctx.db.query.healthCondition.findFirst({
      where: (healthCondition, { eq }) => eq(healthCondition.id, id),
    });
    if (res) return res;
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Health condition not found",
    });
  },

  async getMany({
    input,
    ctx,
  }: {
    input: GetManyHealthConditionsInput;
    ctx: TRPCContext;
  }) {
    const res = await ctx.db.query.healthCondition.findMany({
      limit: input.limit,
      offset: input.offset,
      orderBy: [asc(healthCondition.id)],
    });
    const total = await ctx.db
      .select({ id: healthCondition.id })
      .from(healthCondition);

    if (res)
      return {
        result: res,
        offset: input.offset,
        limit: input.limit,
        total: total.length,
      };
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Health conditions not found",
    });
  },

  async create({
    input,
    ctx,
  }: {
    input: CreateHealthConditionInput;
    ctx: TRPCContext;
  }) {
    const transaction = await ctx.db.transaction(async (tx) => {
      const insert = await tx
        .insert(healthCondition)
        .values({
          name: input.name,
          description: input.description,
        })
        .returning({ id: healthCondition.id })
        .catch((error) => {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error instanceof Error ? error.message : String(error),
          });
        });

      if (insert.length !== 1 && !insert.at(0)?.id)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Health insurance could not created",
        });

      return await tx.query.healthCondition.findFirst({
        where: (healthCondition, { eq }) =>
          eq(healthCondition.id, insert.at(0)!.id!),
      });
    });
    if (transaction) return transaction;
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Health condition not created",
    });
  },

  async update({
    input,
    ctx,
  }: {
    input: UpdateHealthConditionInput;
    ctx: TRPCContext;
  }) {
    const transaction = await ctx.db.transaction(async (tx) => {
      await tx
        .update(healthCondition)
        .set({
          description: input.description,
          name: input.name,
        })
        .where(eq(healthCondition.id, input.id))
        .catch((error) => {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error instanceof Error ? error.message : String(error),
          });
        });

      return await tx.query.healthCondition.findFirst({
        where: (healthCondition, { eq }) => eq(healthCondition.id, input.id),
      });
    });

    if (transaction) return transaction;
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Health condition not updated",
    });
  },
} as const;