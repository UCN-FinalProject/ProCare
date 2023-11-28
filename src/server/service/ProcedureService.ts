import { TRPCError } from "@trpc/server";
import { type TRPCContext } from "../api/trpc";
import type {
  GetManyProceduresInput,
  CreateProcedureInput,
  CreateProcedurePricingInput,
  UpdateProcedurePricingInput,
  UpdateProcedureInput,
} from "./validation/ProcedureValidation";
import { procedurePricing, procedures } from "../db/export";
import { eq } from "drizzle-orm";

export default {
  async getByID({ id, ctx }: { id: number; ctx: TRPCContext }) {
    const procedure = await ctx.db.query.procedures.findFirst({
      where: (procedure, { eq }) => eq(procedure.id, id),
      with: {
        procedurePricing: true,
      },
    });

    if (procedure) return procedure;
    throw new TRPCError({ code: "NOT_FOUND", message: "Procedure not found." });
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

    if (procedures) return procedures;
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
    pricingInput?: CreateProcedurePricingInput[];
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

      if (pricingInput) {
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
    pricingInput,
    ctx,
  }: {
    input: UpdateProcedureInput;
    pricingInput?: UpdateProcedurePricingInput[];
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

      // update procedure pricing for each health insurance
      if (pricingInput) {
        for (const pricing of pricingInput) {
          await tx
            .update(procedurePricing)
            .set({
              credits: pricing.credits,
              price: pricing.price,
            })
            .where(eq(procedurePricing.procedureId, updatedProcedureID))
            .catch((err) => {
              tx.rollback();
              throw err;
            });
        }
      }

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
} as const;
