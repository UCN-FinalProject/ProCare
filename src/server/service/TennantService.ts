import { eq } from "drizzle-orm";
import {
  headDoctor,
  healthCareProvider,
  tennant,
  tennantBankDetails,
  tennantVAT,
} from "../db/export";
import { type TennantInput } from "./validation/TennantValidation";
import { TRPCError } from "@trpc/server";
import { type TRPCContext } from "../api/trpc";
import { parseErrorMessage } from "~/lib/parseError";
import { db } from "~/server/db";

export default {
  async getTennant({ ctx }: { ctx: TRPCContext }) {
    const res = await ctx.db.query.tennant.findFirst({
      with: {
        headDoctor: true,
        healthCareProvider: true,
        tennantBankDetails: true,
        tennantVAT: true,
      },
    });
    if (res) return res;
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Tennant was not found.",
    });
  },

  async updateTennant({
    input,
    ctx,
  }: {
    input: TennantInput;
    ctx: TRPCContext;
  }) {
    // fetch current tennant
    const currentTennant = await this.getTennant({ ctx });

    // TRANSACTION
    const transaction = await ctx.db.transaction(async (tx) => {
      // update tennant
      await tx
        .update(tennant)
        .set({
          basis: input.basis,
          name: input.name,
          regionalAuthority: input.regionalAuthority,
        })
        .where(eq(tennant.id, currentTennant.id))
        .catch((error: unknown) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: parseErrorMessage({
              error,
              defaultMessage: "Could not update the tennant.",
            }),
          });
        });
      // update headDoctor
      await tx
        .update(headDoctor)
        .set({
          headDoctor: input.headDoctor.headDoctor,
          headDoctorID: input.headDoctor.headDoctorID,
        })
        .where(eq(headDoctor.id, currentTennant.headDoctor.id))
        .catch((error: unknown) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: parseErrorMessage({
              error,
              defaultMessage: "Could not update the tennant.",
            }),
          });
        });
      // update healthCareProvider
      await tx
        .update(healthCareProvider)
        .set({
          name: input.healthCareProvider.name,
          address1: input.healthCareProvider.address1,
          address2: input.healthCareProvider.address2,
          city: input.healthCareProvider.city,
          zip: input.healthCareProvider.zip,
        })
        .where(eq(healthCareProvider.id, currentTennant.healthCareProvider.id))
        .catch((error: unknown) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: parseErrorMessage({
              error,
              defaultMessage: "Could not update the tennant.",
            }),
          });
        });
      // update tennantVAT
      await tx
        .update(tennantVAT)
        .set({
          VAT1: input.tennantVAT.VAT1,
          VAT2: input.tennantVAT.VAT2,
          VAT3: input.tennantVAT.VAT3,
        })
        .where(eq(tennantVAT.id, currentTennant.tennantVAT.id))
        .catch((error: unknown) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: parseErrorMessage({
              error,
              defaultMessage: "Could not update the tennant.",
            }),
          });
        });
      // update tennantBankDetails
      await tx
        .update(tennantBankDetails)
        .set({
          bankName: input.tennantBankDetails.bankName,
          IBAN: input.tennantBankDetails.IBAN,
          SWIFT: input.tennantBankDetails.SWIFT,
        })
        .where(eq(tennantBankDetails.id, currentTennant.tennantBankDetails.id))
        .catch((error: unknown) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: parseErrorMessage({
              error,
              defaultMessage: "Could not update the tennant.",
            }),
          });
        });
      return await this.getTennant({ ctx });
    });
    if (transaction) return transaction;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Could not update the tennant.",
    });
  },

  async createTennant({ input }: { input: TennantInput }) {
    const currentTennant = await db.select().from(tennant).limit(1);
    if (currentTennant.length > 0)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Tennant already exists.",
      });

    // TRANSACTION
    const transaction = await db.transaction(async (tx) => {
      // create tennant
      const createTennant = await tx
        .insert(tennant)
        .values({
          basis: input.basis,
          name: input.name,
          regionalAuthority: input.regionalAuthority,
        })
        .returning({ id: tennant.id })
        .catch((error: unknown) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: parseErrorMessage({
              error,
              defaultMessage: "Tennant could not created",
            }),
          });
        });

      if (createTennant.length !== 1 && !createTennant.at(0)?.id)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Tennant could not created",
        });

      // create headDoctor
      await tx
        .insert(headDoctor)
        .values({
          headDoctor: input.headDoctor.headDoctor,
          headDoctorID: input.headDoctor.headDoctorID,
          tennantID: createTennant.at(0)!.id,
        })
        .catch((error: unknown) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: parseErrorMessage({
              error,
              defaultMessage: "Tennant could not created",
            }),
          });
        });
      // create healthCareProvider
      await tx
        .insert(healthCareProvider)
        .values({
          name: input.healthCareProvider.name,
          address1: input.healthCareProvider.address1,
          address2: input.healthCareProvider.address2,
          city: input.healthCareProvider.city,
          zip: input.healthCareProvider.zip,
          tennantID: createTennant.at(0)!.id,
        })
        .catch((error: unknown) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: parseErrorMessage({
              error,
              defaultMessage: "Tennant could not created",
            }),
          });
        });
      // create tennantVAT
      await tx
        .insert(tennantVAT)
        .values({
          VAT1: input.tennantVAT.VAT1,
          VAT2: input.tennantVAT.VAT2,
          VAT3: input.tennantVAT.VAT3,
          tennantID: createTennant.at(0)!.id,
        })
        .catch((error: unknown) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: parseErrorMessage({
              error,
              defaultMessage: "Tennant could not be created.",
            }),
          });
        });
      // create tennantBankDetails
      await tx
        .insert(tennantBankDetails)
        .values({
          bankName: input.tennantBankDetails.bankName,
          IBAN: input.tennantBankDetails.IBAN,
          SWIFT: input.tennantBankDetails.SWIFT,
          tennantID: createTennant.at(0)!.id,
        })
        .catch((error: unknown) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: parseErrorMessage({
              error,
              defaultMessage: "Tennant could not be created.",
            }),
          });
        });
      return true;
    });
    if (transaction) return transaction;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Tennant could not be created.",
    });
  },
} as const;
