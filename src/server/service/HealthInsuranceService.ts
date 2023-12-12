import { TRPCError } from "@trpc/server";
import {
  healthInsurance,
  healthInsuranceAddress,
  healthInsuranceVAT,
} from "../db/export";
import type {
  HealthInsuranceInput,
  GetHealthInsurancesInput,
  UpdateHealthInsuranceInput,
  SetHealthInsuranceStatus,
} from "./validation/HealthInsuranceValidation";
import { type TRPCContext } from "../api/trpc";
import { asc, eq } from "drizzle-orm";
import type { ReturnMany } from "./validation/util";

export default {
  async getByID({ id, ctx }: { id: number; ctx: TRPCContext }) {
    const res = await ctx.db.query.healthInsurance.findFirst({
      with: {
        healthInsuranceAddress: true,
        healthInsuranceVAT: true,
      },
      where: (healthInsurance, { eq }) => eq(healthInsurance.id, id),
    });
    if (res) return res;
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Health insurance not found",
    });
  },

  async getMany({
    input,
    ctx,
  }: {
    input: GetHealthInsurancesInput;
    ctx: TRPCContext;
  }) {
    const res = await ctx.db.query.healthInsurance.findMany({
      limit: input.limit,
      offset: input.offset,
      where: (healthInsurance, { eq }) =>
        input.isActive !== undefined
          ? eq(healthInsurance.isActive, input.isActive)
          : undefined,
      orderBy: [asc(healthInsurance.id)],
    });
    const total = await ctx.db.query.healthInsurance.findMany({
      columns: { id: true },
      where: (healthInsurance, { eq }) =>
        input.isActive !== undefined
          ? eq(healthInsurance.isActive, input.isActive)
          : undefined,
    });
    return {
      result: res,
      limit: input.limit,
      offset: input.offset,
      total: total.length,
    } satisfies ReturnMany<typeof res>;
  },

  // POST (create)
  async create({
    input,
    ctx,
  }: {
    input: HealthInsuranceInput;
    ctx: TRPCContext;
  }) {
    // TRANSACTION
    const transaction = await ctx.db.transaction(async (tx) => {
      const insert = await tx
        .insert(healthInsurance)
        .values({
          insuranceID: input.insuranceID,
          registeredID: input.registeredID,
          name: input.name,
          pricePerCredit: input.pricePerCredit,
          isActive: true,
        })
        .returning({ id: healthInsurance.id })
        .catch((err) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: String(err),
          });
        });

      if (insert.length !== 1 && !insert.at(0)?.id)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Health insurance could not created",
        });

      await tx
        .insert(healthInsuranceAddress)
        .values({
          insuranceID: insert.at(0)!.id!,
          address1: input.address.address1,
          address2: input.address.address2,
          city: input.address.city,
          zip: input.address.zip,
          phoneNumber: input.address.phoneNumber,
          email: input.address.email,
        })
        .catch((err) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: String(err),
          });
        });
      await tx
        .insert(healthInsuranceVAT)
        .values({
          insuranceID: insert.at(0)!.id!,
          vat1: input.vat.VAT1,
          vat2: input.vat.VAT2,
          vat3: input.vat.VAT3 ?? undefined,
        })
        .catch((err) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: String(err),
          });
        });

      return await tx.query.healthInsurance
        .findFirst({
          with: {
            healthInsuranceAddress: true,
            healthInsuranceVAT: true,
          },
          where: (healthInsurance, { eq }) =>
            eq(healthInsurance.insuranceID, input.insuranceID),
        })
        .catch((err) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: String(err),
          });
        });
    });
    if (transaction) return transaction;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Health insurance could not created",
    });
  },

  // POST (update)
  async update({
    input,
    ctx,
  }: {
    input: UpdateHealthInsuranceInput;
    ctx: TRPCContext;
  }) {
    const initialHealthInsurance = await ctx.db.query.healthInsurance.findFirst(
      {
        with: {
          healthInsuranceAddress: true,
          healthInsuranceVAT: true,
        },
        where: (healthInsurance, { eq }) => eq(healthInsurance.id, input.id),
      },
    );
    if (!initialHealthInsurance)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Health insurance not found",
      });

    const transaction = await ctx.db.transaction(async (tx) => {
      await tx
        .update(healthInsurance)
        .set({
          insuranceID: input.insuranceID,
          registeredID: input.registeredID,
          name: input.name,
          pricePerCredit: String(input.pricePerCredit),
        })
        .where(eq(healthInsurance.id, initialHealthInsurance.id))
        .catch((err) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: String(err),
          });
        });
      await tx
        .update(healthInsuranceAddress)
        .set({
          address1: input.address.address1,
          address2: input.address.address2,
          city: input.address.city,
          zip: input.address.zip,
          phoneNumber: input.address.phoneNumber,
          email: input.address.email,
        })
        .where(
          eq(
            healthInsuranceAddress.insuranceID,
            initialHealthInsurance.healthInsuranceAddress?.insuranceID,
          ),
        )
        .catch((err) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: String(err),
          });
        });

      await tx
        .update(healthInsuranceVAT)
        .set({
          vat1: input.vat.VAT1,
          vat2: input.vat.VAT2,
          vat3: input.vat.VAT3 ?? undefined,
        })
        .where(
          eq(
            healthInsuranceVAT.insuranceID,
            initialHealthInsurance.healthInsuranceVAT?.insuranceID,
          ),
        )
        .catch((err) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: String(err),
          });
        });

      return await tx.query.healthInsurance
        .findFirst({
          with: {
            healthInsuranceAddress: true,
            healthInsuranceVAT: true,
          },
          where: (healthInsurance, { eq }) => eq(healthInsurance.id, input.id),
        })
        .catch((err) => {
          tx.rollback();
          throw new Error(String(err));
        });
    });
    if (transaction) return transaction;
    else
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Health insurance could not updated",
      });
  },

  // POST (set inactive)
  async setStatus({
    input,
    ctx,
  }: {
    input: SetHealthInsuranceStatus;
    ctx: TRPCContext;
  }) {
    const initialHealthInsurance = await ctx.db.query.healthInsurance.findFirst(
      {
        where: (healthInsurance, { eq }) => eq(healthInsurance.id, input.id),
      },
    );
    if (!initialHealthInsurance)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Health insurance not found",
      });

    const setStatus = await ctx.db
      .update(healthInsurance)
      .set({
        isActive: input.isActive,
      })
      .where(eq(healthInsurance.id, initialHealthInsurance.id))
      .returning();

    if (setStatus) return setStatus;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Health insurance status could not updated",
    });
  },
} as const;
