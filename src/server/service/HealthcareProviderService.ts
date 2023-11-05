import { TRPCError } from "@trpc/server";
import { db } from "../db";
import {
  type GetManyHealthCareProvidersInput,
  type CreateHealthCareProviderInput,
  type UpdateHealthCareProviderInput,
} from "./validation/HealthCareProviderValidation";
import { externalhHealthcareProvider } from "../db/export";
import { eq } from "drizzle-orm";

export default {
  async getByID(id: number) {
    const res = await db.query.externalhHealthcareProvider.findFirst({
      where: (healthCareProvider, { eq }) => eq(healthCareProvider.id, id),
    });
    if (!res)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Healthcare provider not found",
      });
    return res;
  },

  async getMany(input: GetManyHealthCareProvidersInput) {
    const res = await db.query.externalhHealthcareProvider.findMany({
      limit: input.limit,
      offset: input.offset,
      where: (healthCareProvider, { eq }) =>
        !!!input.isActive
          ? eq(healthCareProvider.isActive, input.isActive!)
          : undefined,
    });
    if (!res)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Healthcare providers not found",
      });
    return res;
  },

  async create(input: CreateHealthCareProviderInput) {
    const transaction = await db.transaction(async (tx) => {
      const insert = await db
        .insert(externalhHealthcareProvider)
        .values({
          name: input.name,
          healthcareProviderCode: input.healthcareProviderCode,
          VAT: input.VAT,
          address1: input.address1,
          address2: input.address2,
          city: input.city,
          zip: input.zip,
          dateFrom: input.dateFrom,
          dateUntil: input.dateUntil,
          note: input.note,
          isActive: true,
        })
        .returning({ id: externalhHealthcareProvider.id })
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

      return await tx.query.externalhHealthcareProvider.findFirst({
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

  async update(input: UpdateHealthCareProviderInput) {
    const transaction = await db.transaction(async (tx) => {
      await tx
        .update(externalhHealthcareProvider)
        .set({
          name: input.name,
          healthcareProviderCode: input.healthcareProviderCode,
          VAT: input.VAT,
          address1: input.address1,
          address2: input.address2,
          city: input.city,
          zip: input.zip,
          dateFrom: input.dateFrom,
          dateUntil: input.dateUntil,
          note: input.note,
        })
        .where(eq(externalhHealthcareProvider.id, input.id))
        .catch((error) => {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error instanceof Error ? error.message : String(error),
          });
        });
      return await tx.query.externalhHealthcareProvider.findFirst({
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

  // Set active
  async setActive(id: number) {
    const transaction = await db.transaction(async (tx) => {
      await tx
        .update(externalhHealthcareProvider)
        .set({
          isActive: true,
        })
        .where(eq(externalhHealthcareProvider.id, id))
        .catch((error) => {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error instanceof Error ? error.message : String(error),
          });
        });
      return await tx.query.externalhHealthcareProvider.findFirst({
        where: (healthCareProvider, { eq }) => eq(healthCareProvider.id, id),
      });
    });

    if (transaction) return transaction;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Healthcare could not be updated",
    });
  },

  // Set inactive
  async setInactive(id: number) {
    const transaction = await db.transaction(async (tx) => {
      await tx
        .update(externalhHealthcareProvider)
        .set({
          isActive: false,
        })
        .where(eq(externalhHealthcareProvider.id, id))
        .catch((error) => {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error instanceof Error ? error.message : String(error),
          });
        });
      return await tx.query.externalhHealthcareProvider.findFirst({
        where: (healthCareProvider, { eq }) => eq(healthCareProvider.id, id),
      });
    });

    if (transaction) return transaction;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Healthcare could not be updated",
    });
  },
} as const;
