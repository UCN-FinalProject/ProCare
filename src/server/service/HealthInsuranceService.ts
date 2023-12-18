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
    throw new Error("Health insurance not found.");
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
    if (res)
      return {
        result: res,
        limit: input.limit,
        offset: input.offset,
        total: total.length,
      } satisfies ReturnMany<typeof res>;
    throw new Error("Health insurances not found.");
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
        .returning();

      if (insert && insert.length !== 1)
        throw new Error("Health insurance could not created");
      const id = insert.at(0)!.id!;

      await tx.insert(healthInsuranceAddress).values({
        insuranceID: id,
        address1: input.address.address1,
        address2: input.address.address2,
        city: input.address.city,
        zip: input.address.zip,
        phoneNumber: input.address.phoneNumber,
        email: input.address.email,
      });
      await tx.insert(healthInsuranceVAT).values({
        insuranceID: id,
        vat1: input.vat.VAT1,
        vat2: input.vat.VAT2,
        vat3: input.vat.VAT3 ?? undefined,
      });

      return await tx.query.healthInsurance.findFirst({
        with: {
          healthInsuranceAddress: true,
          healthInsuranceVAT: true,
        },
        where: (healthInsurance, { eq }) =>
          eq(healthInsurance.insuranceID, input.insuranceID),
      });
    });
    if (transaction) return transaction;
    throw new Error("Health insurance could not be created.");
  },

  // POST (update)
  async update({
    input,
    ctx,
  }: {
    input: UpdateHealthInsuranceInput;
    ctx: TRPCContext;
  }) {
    const transaction = await ctx.db.transaction(async (tx) => {
      await tx
        .update(healthInsurance)
        .set({
          insuranceID: input.insuranceID,
          registeredID: input.registeredID,
          name: input.name,
          pricePerCredit: String(input.pricePerCredit),
        })
        .where(eq(healthInsurance.id, input.id));
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
        .where(eq(healthInsuranceAddress.insuranceID, input.insuranceID));

      await tx
        .update(healthInsuranceVAT)
        .set({
          vat1: input.vat.VAT1,
          vat2: input.vat.VAT2,
          vat3: input.vat.VAT3 ?? undefined,
        })
        .where(eq(healthInsuranceVAT.insuranceID, input.insuranceID));

      return await tx.query.healthInsurance.findFirst({
        with: {
          healthInsuranceAddress: true,
          healthInsuranceVAT: true,
        },
        where: (healthInsurance, { eq }) => eq(healthInsurance.id, input.id),
      });
    });
    if (transaction) return transaction;
    throw new Error("Health insurance could not updated");
  },

  // POST (set inactive)
  async setStatus({
    input,
    ctx,
  }: {
    input: SetHealthInsuranceStatus;
    ctx: TRPCContext;
  }) {
    const setStatus = await ctx.db
      .update(healthInsurance)
      .set({
        isActive: input.isActive,
      })
      .where(eq(healthInsurance.id, input.id))
      .returning();

    if (setStatus) return setStatus;
    throw new Error("Health insurance status could not updated");
  },
} as const;
