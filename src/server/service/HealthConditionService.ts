import {
  type GetManyHealthConditionsInput,
  type CreateHealthConditionInput,
  type UpdateHealthConditionInput,
} from "./validation/HealthConditionValidation";
import { type TRPCContext } from "../api/trpc";
import { healthCondition } from "../db/export";
import { eq } from "drizzle-orm";
import type { ReturnMany } from "./validation/util";

export default {
  async getByID({ id, ctx }: { id: number; ctx: TRPCContext }) {
    const res = await ctx.db.query.healthCondition.findFirst({
      where: (healthCondition, { eq }) => eq(healthCondition.id, id),
    });
    if (res) return res;
    throw new Error("Health condition not found.");
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
      where: (healthCondition, { like }) =>
        input.name ? like(healthCondition.name, `%${input.name}%`) : undefined,
      orderBy: (healthCondition, { asc }) => asc(healthCondition.id),
    });
    const total = await ctx.db.query.healthCondition.findMany({
      limit: input.limit,
      offset: input.offset,
      where: (healthCondition, { like }) =>
        input.name ? like(healthCondition.name, `%${input.name}%`) : undefined,
      orderBy: (healthCondition, { asc }) => asc(healthCondition.id),
      columns: { id: true },
    });

    if (res)
      return {
        result: res,
        offset: input.offset,
        limit: input.limit,
        total: total.length,
      } satisfies ReturnMany<typeof res>;
    throw new Error("Health conditions not found.");
  },

  async create({
    input,
    ctx,
  }: {
    input: CreateHealthConditionInput;
    ctx: TRPCContext;
  }) {
    const create = await ctx.db
      .insert(healthCondition)
      .values({
        name: input.name,
        description: input.description,
      })
      .returning();

    if (create && create.length === 1) return create[0];
    throw new Error("Health condition could not be created.");
  },

  async update({
    input,
    ctx,
  }: {
    input: UpdateHealthConditionInput;
    ctx: TRPCContext;
  }) {
    const update = await ctx.db
      .update(healthCondition)
      .set({
        description: input.description,
        name: input.name,
      })
      .where(eq(healthCondition.id, input.id))
      .returning();

    if (update && update.length === 1) return update[0];
    throw new Error("Health condition could not be updated.");
  },
} as const;
