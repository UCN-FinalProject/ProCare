import { TRPCError } from "@trpc/server";
import {
  type GetManyHealthCareProvidersInput,
  type CreateHealthCareProviderInput,
  type UpdateHealthCareProviderInput,
  type SetStatusHealthCareProviderInput,
  type AddDoctorInput,
  type RemoveDoctorInput,
} from "./validation/HealthCareProviderValidation";
import {
  externalHealthcareProvider,
  healthcareProviderDoctors,
} from "../db/export";
import { type TRPCContext } from "../api/trpc";
import { asc, eq, like } from "drizzle-orm";
import type { ReturnMany } from "./validation/util";

export default {
  async getByID({ id, ctx }: { id: number; ctx: TRPCContext }) {
    const res = await ctx.db.query.externalHealthcareProvider.findFirst({
      where: (healthCareProvider, { eq }) => eq(healthCareProvider.id, id),
    });
    if (!res)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Healthcare provider not found",
      });
    return res;
  },

  async getMany({
    input,
    ctx,
  }: {
    input: GetManyHealthCareProvidersInput;
    ctx: TRPCContext;
  }) {
    const res = await ctx.db.query.externalHealthcareProvider.findMany({
      limit: input.limit,
      offset: input.offset,
      where: findManyWhere(input),
      orderBy: (healthcareProviderDoctors, { asc }) =>
        asc(healthcareProviderDoctors.id),
    });
    const total = await ctx.db.query.externalHealthcareProvider.findMany({
      columns: { id: true },
      limit: input.limit,
      offset: input.offset,
      where: findManyWhere(input),
      orderBy: (healthcareProviderDoctors, { asc }) =>
        asc(healthcareProviderDoctors.id),
    });
    if (!res)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Healthcare providers not found",
      });
    return {
      result: res,
      offset: input.offset,
      limit: input.limit,
      total: total.length,
    } satisfies ReturnMany<typeof res>;
  },

  async create({
    input,
    ctx,
  }: {
    input: CreateHealthCareProviderInput;
    ctx: TRPCContext;
  }) {
    const transaction = await ctx.db.transaction(async (tx) => {
      const insert = await tx
        .insert(externalHealthcareProvider)
        .values({
          name: input.name,
          healthcareProviderCode: input.healthcareProviderCode,
          VAT: input.VAT,
          address1: input.address1,
          address2: input.address2,
          city: input.city,
          zip: input.zip,
          note: input.note,
          isActive: true,
        })
        .returning({ id: externalHealthcareProvider.id })
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

      return await tx.query.externalHealthcareProvider.findFirst({
        where: (healthCareProvider, { eq }) =>
          eq(healthCareProvider.id, insert.at(0)!.id!),
      });
    });

    if (transaction) return transaction;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Healthcare provider could not be created",
    });
  },

  async update({
    input,
    ctx,
  }: {
    input: UpdateHealthCareProviderInput;
    ctx: TRPCContext;
  }) {
    const transaction = await ctx.db.transaction(async (tx) => {
      await tx
        .update(externalHealthcareProvider)
        .set({
          name: input.name,
          healthcareProviderCode: input.healthcareProviderCode,
          VAT: input.VAT,
          address1: input.address1,
          address2: input.address2 ?? null,
          city: input.city,
          zip: input.zip,
          note: input.note ?? null,
        })
        .where(eq(externalHealthcareProvider.id, input.id))
        .catch((error) => {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error instanceof Error ? error.message : String(error),
          });
        });
      return await tx.query.externalHealthcareProvider.findFirst({
        where: (healthCareProvider, { eq }) =>
          eq(healthCareProvider.id, input.id),
      });
    });

    if (transaction) return transaction;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Healthcare provider could not be updated",
    });
  },

  async setStatus({
    input,
    ctx,
  }: {
    input: SetStatusHealthCareProviderInput;
    ctx: TRPCContext;
  }) {
    const transaction = await ctx.db.transaction(async (tx) => {
      await tx
        .update(externalHealthcareProvider)
        .set({
          isActive: input.isActive,
        })
        .where(eq(externalHealthcareProvider.id, input.id))
        .catch((error) => {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error instanceof Error ? error.message : String(error),
          });
        });
      return await tx.query.externalHealthcareProvider.findFirst({
        where: (healthCareProvider, { eq }) =>
          eq(healthCareProvider.id, input.id),
      });
    });

    if (transaction) return transaction;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Healthcare provider could not be updated",
    });
  },

  // TODO: test and improve return structure
  async getDoctors({ id, ctx }: { id: number; ctx: TRPCContext }) {
    const res = await ctx.db.query.healthcareProviderDoctors.findMany({
      where: (healthCareProviderDoctor, { eq }) =>
        eq(healthCareProviderDoctor.healthcareProviderID, id),
      orderBy: [asc(healthcareProviderDoctors.id)],
      with: {
        doctors: true,
      },
    });
    if (res) return res;
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Doctors not found",
    });
  },

  async addDoctor({ input, ctx }: { input: AddDoctorInput; ctx: TRPCContext }) {
    const transaction = await ctx.db.transaction(async (tx) => {
      const checkIfAlreadyAdded =
        await tx.query.healthcareProviderDoctors.findFirst({
          where: (healthcareProviderDoctors, { eq }) =>
            eq(
              healthcareProviderDoctors.healthcareProviderID,
              input.healthcareProviderID,
            ) && eq(healthcareProviderDoctors.doctorID, input.doctorID),
        });
      if (checkIfAlreadyAdded)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Doctor already added",
        });

      await tx
        .insert(healthcareProviderDoctors)
        .values({
          healthcareProviderID: input.healthcareProviderID,
          doctorID: input.doctorID,
        })
        .catch((error) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error instanceof Error ? error.message : String(error),
          });
        });
      return "Doctor added" as const;
    });

    if (transaction) return transaction;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Doctor could not be added",
    });
  },

  async removeDoctor({
    input,
    ctx,
  }: {
    input: RemoveDoctorInput;
    ctx: TRPCContext;
  }) {
    const transaction = await ctx.db.transaction(async (tx) => {
      await tx
        .delete(healthcareProviderDoctors)
        .where(
          eq(
            healthcareProviderDoctors.healthcareProviderID,
            input.healthcareProviderID,
          ) && eq(healthcareProviderDoctors.doctorID, input.doctorID),
        )
        .catch((error) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error instanceof Error ? error.message : String(error),
          });
        });
      return "Doctor removed" as const;
    });
    if (transaction) return transaction;
  },
} as const;

const findManyWhere = (input: GetManyHealthCareProvidersInput) => {
  let where = undefined;
  if (input.isActive !== undefined)
    where = eq(externalHealthcareProvider.isActive, input.isActive);
  if (input.name !== undefined)
    where = like(externalHealthcareProvider.name, `%${input.name}%`);
  if (input.providerId !== undefined)
    where = like(
      externalHealthcareProvider.healthcareProviderCode,
      `%${input.providerId}%`,
    );
  return where;
};
