import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { users } from "../db/export";
import {
  type UpdateUserInput,
  type CreateUserInput,
} from "../service/validation/UserValidation";
import { type TRPCContext } from "../api/trpc";

export default {
  async getByID({ id, ctx }: { id: string; ctx: TRPCContext }) {
    const res = await ctx.db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, id),
      with: {
        credentials: true,
      },
    });

    if (res) {
      return {
        ...res,
        credentials: res.credentials.map((credential) => {
          return {
            id: credential.id,
            transports: credential.transports,
          };
        }),
      };
    }

    if (res) return res;
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  },

  async getMany(ctx: TRPCContext) {
    const res = await ctx.db.query.users.findMany({
      orderBy: [desc(users.emailVerified)],
    });

    if (res) return res;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Users not be created.",
    });
  },

  async create({ input, ctx }: { input: CreateUserInput; ctx: TRPCContext }) {
    const user = await ctx.db.insert(users).values({
      id: crypto.randomUUID(),
      email: input.email,
      name: input.name,
      role: input.role,
      doctorID: input.doctorID,
    });

    if (user) return input.email;
  },

  async update({ input, ctx }: { input: UpdateUserInput; ctx: TRPCContext }) {
    const transaction = await ctx.db.transaction(async (trx) => {
      await trx
        .update(users)
        .set({
          name: input.name,
          role: input.role,
          doctorID: input.doctorID,
        })
        .where(eq(users.id, input.id));

      return await trx.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, input.id),
      });
    });

    if (transaction) return transaction;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "User could not be updated.",
    });
  },
} as const;
