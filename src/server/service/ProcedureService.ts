import { type TRPCContext } from "../api/trpc";
import type {
  GetManyProceduresInput,
  CreateProcedureInput,
  CreateProcedurePricingInput,
  UpdateProcedureInput,
  CreateProcedurePricingWithoutProcedureID,
} from "./validation/ProcedureValidation";
import {
  type ProcedurePricing,
  procedurePricing,
  procedures,
} from "../db/export";
import { eq } from "drizzle-orm";
import HealthInsuranceService from "./HealthInsuranceService";
import type { ReturnMany } from "./validation/util";

export default {
  async getByID({ id, ctx }: { id: number; ctx: TRPCContext }) {
    // fetch the procedure with procedurePricing array
    const procedure = await ctx.db.query.procedures.findFirst({
      where: (procedure, { eq }) => eq(procedure.id, id),
    });

    if (!procedure) throw new Error("Procedure not found.");

    const healthInsurances = await HealthInsuranceService.getMany({
      ctx,
      input: {
        limit: 100,
        offset: 0,
        isActive: true,
      },
    });

    const procedurePricing: ProcedurePricing[] = [];
    for (const insurance of healthInsurances.result) {
      const pricing = await ctx.db.query.procedurePricing.findMany({
        limit: 1,
        orderBy: (pricing, { desc }) => desc(pricing.created),
        where: (pricing, { and, eq }) =>
          and(
            eq(pricing.procedureId, procedure.id),
            eq(pricing.healthInsuranceId, insurance.id),
          ),
      });
      if (pricing.length > 0) procedurePricing.push(pricing[0]!);
    }

    // map procedure pricing with health insurance and return only the ones with the latest Date
    const procedureWithPricing = procedurePricing.map((pricing) => {
      const healthInsurance = healthInsurances.result.find(
        (insurance) => insurance.id === pricing.healthInsuranceId,
      )!;

      return {
        ...pricing,
        healthInsurance: healthInsurance,
      };
    });

    return {
      id: procedure.id,
      name: procedure.name,
      procedurePricing: procedureWithPricing,
    };
  },

  async getMany({
    input,
    ctx,
  }: {
    input: GetManyProceduresInput;
    ctx: TRPCContext;
  }) {
    const procedures = await ctx.db.query.procedures.findMany({
      limit: input.limit,
      offset: input.offset,
      where: (procedure, { like }) =>
        input.name !== undefined
          ? like(procedure.name, `%${input.name}%`)
          : undefined,
      orderBy: (procedure, { asc }) => asc(procedure.id),
    });
    const total = await ctx.db.query.procedures.findMany({
      where: (procedure, { like }) =>
        input.name !== undefined
          ? like(procedure.name, `%${input.name}%`)
          : undefined,
      columns: {
        id: true,
      },
    });

    if (procedures)
      return {
        result: procedures,
        limit: input.limit,
        offset: input.offset,
        total: total.length,
      } satisfies ReturnMany<typeof procedures>;
    throw new Error("Procedures not found.");
  },

  async create({
    input,
    pricingInput,
    ctx,
  }: {
    input: CreateProcedureInput;
    pricingInput: CreateProcedurePricingWithoutProcedureID[];
    ctx: TRPCContext;
  }) {
    const transaction = await ctx.db.transaction(async (tx) => {
      const createdProcedure = await tx
        .insert(procedures)
        .values({ name: input.name })
        .returning()
        .catch((err) => {
          tx.rollback();
          throw err;
        });

      if (
        !createdProcedure ||
        createdProcedure.length === 0 ||
        !createdProcedure[0]
      ) {
        tx.rollback();
        throw new Error("Procedure could not be created.");
      }

      const createdProcedureID = createdProcedure[0].id;

      // create procedure pricing for each health insurance
      for (const pricing of pricingInput) {
        await tx
          .insert(procedurePricing)
          .values({
            procedureId: createdProcedureID,
            healthInsuranceId: pricing.healthInsuranceId,
            credits: pricing.credits,
            price: pricing.price,
          })
          .catch((err) => {
            tx.rollback();
            throw err;
          });
      }
      return createdProcedure[0];
    });

    if (transaction) return transaction;
    throw new Error("Procedure could not be created.");
  },

  async update({
    input,
    ctx,
  }: {
    input: UpdateProcedureInput;
    ctx: TRPCContext;
  }) {
    const transaction = await ctx.db.transaction(async (tx) => {
      const updatedProcedure = await tx
        .update(procedures)
        .set({ name: input.name })
        .where(eq(procedures.id, input.id))
        .returning()
        .catch((err) => {
          tx.rollback();
          throw err;
        });

      if (
        !updatedProcedure ||
        updatedProcedure.length === 0 ||
        !updatedProcedure[0]
      ) {
        tx.rollback();
        throw new Error("Procedure could not be updated.");
      }

      const updatedProcedureID = updatedProcedure[0].id;

      return await tx.query.procedures.findFirst({
        where: (procedure, { eq }) => eq(procedure.id, updatedProcedureID),
      });
    });

    if (transaction) return transaction;
    throw new Error("Procedure could not be updated.");
  },

  async addPricing({
    input,
    ctx,
  }: {
    input: CreateProcedurePricingInput;
    ctx: TRPCContext;
  }) {
    const createdPricing = await ctx.db
      .insert(procedurePricing)
      .values({
        healthInsuranceId: input.healthInsuranceId,
        procedureId: input.procedureId,
        credits: input.credits,
        price: input.price,
      })
      .returning();

    if (createdPricing) return createdPricing;
    throw new Error("Procedure pricing could not be created.");
  },
} as const;
