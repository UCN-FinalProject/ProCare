import { TRPCError } from "@trpc/server";
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

export default {
  async getByID({ id, ctx }: { id: number; ctx: TRPCContext }) {
    // fetch the procedure with procedurePricing array
    const procedure = await ctx.db.query.procedures.findFirst({
      where: (procedure, { eq }) => eq(procedure.id, id),
      with: {
        procedurePricing: true,
      },
    });

    if (!procedure)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Procedure not found.",
      });

    // sort the procedurePricing array by created date and return only the latest one for each health insurance
    const latestProcedurePricing = procedure.procedurePricing.reduce(
      (accumulator, currentObject) => {
        const currentHealthInsuranceId = currentObject.healthInsuranceId;

        // Check if there is no object for the current healthInsuranceId or if the current object has a later created date
        if (
          !accumulator[currentHealthInsuranceId] ||
          currentObject.created > accumulator[currentHealthInsuranceId].created
        ) {
          accumulator[currentHealthInsuranceId] = currentObject;
        }

        return accumulator;
      },
      {},
    );

    // Convert the result back to an array
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const resultArray = Object.values(
      latestProcedurePricing,
    ) as ProcedurePricing[];

    // fetch all health insurances
    const healthInsurances = await HealthInsuranceService.getHealthInsurances({
      ctx,
      input: {
        limit: 100,
        offset: 0,
        isActive: true,
      },
    });

    // map procedure pricing with health insurance and return only the ones with the latest Date
    const procedurePricing = resultArray.map((pricing) => {
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
      procedurePricing,
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
    });
    const total = await ctx.db.query.procedures.findMany({
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
      };
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Procedures not found.",
    });
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Procedure could not be created.",
        });
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

      return await tx.query.procedures.findFirst({
        where: (procedure, { eq }) => eq(procedure.id, createdProcedureID),
      });
    });

    if (transaction) return transaction;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Procedure could not be created.",
    });
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Procedure could not be updated.",
        });
      }

      const updatedProcedureID = updatedProcedure[0].id;

      return await tx.query.procedures.findFirst({
        where: (procedure, { eq }) => eq(procedure.id, updatedProcedureID),
      });
    });

    if (transaction) return transaction;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Procedure could not be updated.",
    });
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
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Procedure pricing could not be created.",
    });
  },
} as const;
