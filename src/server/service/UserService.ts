import { TRPCError } from "@trpc/server";
import { eq, like } from "drizzle-orm";
import { users } from "../db/export";
import type {
  UpdateUserInput,
  CreateUserInput,
  GetManyUsersInput,
} from "../service/validation/UserValidation";
import { type TRPCContext } from "../api/trpc";
import type { ReturnMany } from "./validation/util";

export default {
  async getByID({ id, ctx }: { id: string; ctx: TRPCContext }) {
    const res = await ctx.db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    });

    if (res) return res;

    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  },

  async getCredentialsByUserID({ id, ctx }: { id: string; ctx: TRPCContext }) {
    const res = await ctx.db.query.credentials.findMany({
      where: (credential, { eq }) => eq(credential.userId, id),
    });

    if (res) return res;

    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Credentials not found",
    });
  },

  async getMany({
    input,
    ctx,
  }: {
    input: GetManyUsersInput;
    ctx: TRPCContext;
  }) {
    const res = await ctx.db.query.users.findMany({
      limit: input.limit,
      offset: input.offset,
      where: () => findManyWhere(input),
      orderBy: (users, { asc }) => asc(users.role),
    });
    const total = await ctx.db.query.users.findMany({
      columns: { id: true },
      limit: input.limit,
      offset: input.offset,
      where: () => findManyWhere(input),
    });

    if (res)
      return {
        limit: input.limit,
        offset: input.offset,
        result: res,
        total: total.length,
      } satisfies ReturnMany<typeof res>;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Users not found.",
    });
  },

  async create({ input, ctx }: { input: CreateUserInput; ctx: TRPCContext }) {
    const checkIfExist = await ctx.db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, input.email),
    });

    if (checkIfExist)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User with this email already exists.",
      });

    const user = await ctx.db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        email: input.email,
        name: input.name,
        role: input.role,
        doctorID: input.doctorID,
      })
      .returning();

    if (user.length !== 1 && !user.at(0)?.id)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "User could not be created",
      });

    if (user) return user.at(0)?.id;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "User could not be created",
    });
  },

  async update({ input, ctx }: { input: UpdateUserInput; ctx: TRPCContext }) {
    const user = await ctx.db
      .update(users)
      .set({
        name: input.name,
        role: input.role,
        doctorID: input.doctorID ?? null,
      })
      .where(eq(users.id, input.id))
      .returning();

    if (user) return user;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "User could not be updated.",
    });
  },
} as const;

const findManyWhere = (input: GetManyUsersInput) => {
  let where = undefined;
  if (input.role !== undefined) where = eq(users.role, input.role);
  if (input.name !== undefined) where = like(users.name, `%${input.name}%`);
  if (input.email !== undefined) where = like(users.email, `%${input.email}%`);
  return where;
};
