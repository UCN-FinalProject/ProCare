import { eq } from "drizzle-orm";
import {
  headDoctor,
  healthCareProvider,
  tennant,
  tennantBankDetails,
  tennantVAT,
} from "../db/export";
import { type TennantInput } from "./validation/TennantValidation";
import { type TRPCContext } from "../api/trpc";
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
    throw new Error("Tennant not found.");
  },

  async update({ input, ctx }: { input: TennantInput; ctx: TRPCContext }) {
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
        .where(eq(tennant.id, currentTennant.id));
      // update headDoctor
      await tx
        .update(headDoctor)
        .set({
          headDoctor: input.headDoctor.headDoctor,
          headDoctorID: input.headDoctor.headDoctorID,
        })
        .where(eq(headDoctor.id, currentTennant.headDoctor.id));
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
        .where(eq(healthCareProvider.id, currentTennant.healthCareProvider.id));
      // update tennantVAT
      await tx
        .update(tennantVAT)
        .set({
          VAT1: input.tennantVAT.VAT1,
          VAT2: input.tennantVAT.VAT2,
          VAT3: input.tennantVAT.VAT3,
        })
        .where(eq(tennantVAT.id, currentTennant.tennantVAT.id));
      // update tennantBankDetails
      await tx
        .update(tennantBankDetails)
        .set({
          bankName: input.tennantBankDetails.bankName,
          IBAN: input.tennantBankDetails.IBAN,
          SWIFT: input.tennantBankDetails.SWIFT,
        })
        .where(eq(tennantBankDetails.id, currentTennant.tennantBankDetails.id));
      return await this.getTennant({ ctx });
    });
    if (transaction) return transaction;
    throw new Error("Tennant could not be updated.");
  },

  async create({ input }: { input: TennantInput }) {
    const currentTennant = await db.query.tennant.findFirst();
    if (currentTennant) throw new Error("Tennant already exists.");

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
        .returning();
      if (createTennant.length !== 1 && !createTennant.at(0)?.id)
        throw new Error("Tennant could not created");

      const id = createTennant.at(0)!.id;

      // create headDoctor
      await tx.insert(headDoctor).values({
        headDoctor: input.headDoctor.headDoctor,
        headDoctorID: input.headDoctor.headDoctorID,
        tennantID: id,
      });
      // create healthCareProvider
      await tx.insert(healthCareProvider).values({
        name: input.healthCareProvider.name,
        address1: input.healthCareProvider.address1,
        address2: input.healthCareProvider.address2,
        city: input.healthCareProvider.city,
        zip: input.healthCareProvider.zip,
        tennantID: id,
      });
      // create tennantVAT
      await tx.insert(tennantVAT).values({
        VAT1: input.tennantVAT.VAT1,
        VAT2: input.tennantVAT.VAT2,
        VAT3: input.tennantVAT.VAT3,
        tennantID: id,
      });
      // create tennantBankDetails
      await tx.insert(tennantBankDetails).values({
        bankName: input.tennantBankDetails.bankName,
        IBAN: input.tennantBankDetails.IBAN,
        SWIFT: input.tennantBankDetails.SWIFT,
        tennantID: id,
      });

      return await tx.query.tennant.findFirst({
        with: {
          headDoctor: true,
          healthCareProvider: true,
          tennantBankDetails: true,
          tennantVAT: true,
        },
      });
    });
    if (transaction) return transaction;
    throw new Error("Tennant could not be created.");
  },
} as const;
