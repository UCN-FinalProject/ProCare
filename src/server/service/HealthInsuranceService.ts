import { TRPCError } from "@trpc/server";
import { db } from "../db";
import {
  healthInsurance,
  healthInsuranceAddress,
  healthInsuranceVAT,
} from "../db/export";
import {
  type HealthInsuranceInput,
  type GetHealthInsurancesInput,
  type UpdateHealthInsuranceInput,
} from "./validation/HealthInsurance";
import { asc, eq } from "drizzle-orm";

export default {
  async getHealthInsuranceByID(id: number) {
    const res = await db.query.healthInsurance.findFirst({
      with: {
        healthInsuranceAddress: true,
        healthInsuranceVAT: true,
      },
      where: (healthInsurance, { eq }) => eq(healthInsurance.id, id),
    });
    if (!res) throw new Error("Health insurance not found");
    if (!res.healthInsuranceAddress)
      throw new Error("Health insurance address not found");
    if (!res.healthInsuranceVAT)
      throw new Error("Health insurance VAT not found");
    return res;
  },

  async getHealthInsurances(input: GetHealthInsurancesInput) {
    const res = await db.query.healthInsurance.findMany({
      limit: input.limit,
      offset: input.offset,
      where: (healthInsurance, { eq }) =>
        input.isActive
          ? eq(healthInsurance.isActive, input.isActive)
          : undefined,
      orderBy: [asc(healthInsurance.id)],
    });
    const total = await db
      .select({ id: healthInsurance.id })
      .from(healthInsurance);
    if (!res) throw new Error("Health insurances not found");
    return {
      result: res,
      limit: input.limit,
      offset: input.offset,
      total: total.length,
    };
  },

  // POST (create)
  async createHealthInsurance(input: {
    healthInsurance: HealthInsuranceInput;
  }) {
    // TRANSACTION
    const transaction = await db.transaction(async (tx) => {
      const insert = await tx
        .insert(healthInsurance)
        .values({
          insuranceID: input.healthInsurance.insuranceID,
          registeredID: input.healthInsurance.registeredID,
          name: input.healthInsurance.name,
          pricePerCredit: input.healthInsurance.pricePerCredit,
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
          address1: input.healthInsurance.address.address1,
          address2: input.healthInsurance.address.address2,
          city: input.healthInsurance.address.city,
          zip: input.healthInsurance.address.zip,
          phoneNumber: input.healthInsurance.address.phoneNumber,
          email: input.healthInsurance.address.email,
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
          vat1: input.healthInsurance.vat.VAT1,
          vat2: input.healthInsurance.vat.VAT2,
          vat3: input.healthInsurance.vat.VAT3 ?? undefined,
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
            eq(healthInsurance.insuranceID, input.healthInsurance.insuranceID),
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
  async updateHealthInsurance(input: UpdateHealthInsuranceInput) {
    const initialHealthInsurance = await db.query.healthInsurance.findFirst({
      with: {
        healthInsuranceAddress: true,
        healthInsuranceVAT: true,
      },
      where: (healthInsurance, { eq }) => eq(healthInsurance.id, input.id),
    });
    if (!initialHealthInsurance)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Health insurance not found",
      });

    const transaction = await db.transaction(async (tx) => {
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

  // POST (set active)
  async setActiveHealthInsurance(id: number) {
    const initialHealthInsurance = await db.query.healthInsurance.findFirst({
      where: (healthInsurance, { eq }) => eq(healthInsurance.id, id),
    });
    if (!initialHealthInsurance)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Health insurance not found",
      });

    const transaction = await db.transaction(async (tx) => {
      await tx
        .update(healthInsurance)
        .set({
          isActive: true,
        })
        .where(eq(healthInsurance.id, initialHealthInsurance.id))
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
          where: (healthInsurance, { eq }) => eq(healthInsurance.id, id),
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
  async setInactiveHealthInsurance(id: number) {
    const initialHealthInsurance = await db.query.healthInsurance.findFirst({
      where: (healthInsurance, { eq }) => eq(healthInsurance.id, id),
    });
    if (!initialHealthInsurance)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Health insurance not found",
      });

    const transaction = await db.transaction(async (tx) => {
      await tx
        .update(healthInsurance)
        .set({
          isActive: false,
        })
        .where(eq(healthInsurance.id, initialHealthInsurance.id))
        .catch((err) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: String(err),
          });
        });

      return await tx.query.healthInsurance
        .findFirst({
          where: (healthInsurance, { eq }) => eq(healthInsurance.id, id),
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
} as const;
