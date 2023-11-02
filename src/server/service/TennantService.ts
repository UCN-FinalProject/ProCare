import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  type Tennant,
  headDoctor,
  healthCareProvider,
  tennant,
  tennantBankDetails,
  tennantVAT,
} from "../db/export";
import { type TennantInput } from "./validation";

export default {
  async getTennant(): Promise<Tennant> {
    const res = (
      await db
        .select()
        .from(tennant)
        .leftJoin(headDoctor, eq(headDoctor.tennantID, tennant.id))
        .leftJoin(
          healthCareProvider,
          eq(healthCareProvider.tennantID, tennant.id),
        )
        .leftJoin(
          tennantBankDetails,
          eq(tennantBankDetails.tennantID, tennant.id),
        )
        .leftJoin(tennantVAT, eq(tennantVAT.tennantID, tennant.id))
        .limit(1)
    )[0];
    if (!res) throw new Error("Tennant not found");
    if (!res.head_doctor) throw new Error("Head doctor not found");
    if (!res.health_care_provider)
      throw new Error("Health care provider not found");
    if (!res.tennant_bank_details)
      throw new Error("Tennant bank details not found");
    if (!res.tennant_vat) throw new Error("Tennant VAT not found");
    return {
      ...res.tennant,
      headDoctor: res.head_doctor,
      healthCareProvider: res.health_care_provider,
      tennantBankDetails: res.tennant_bank_details,
      tennantVAT: res.tennant_vat,
    };
  },

  async updateTennant(input: { tennant: TennantInput }): Promise<Tennant> {
    // fetch current tennant
    const currentTennant = await this.getTennant();
    if (!currentTennant) throw new Error("Tennant not found");

    // TRANSACTION
    await db.transaction(async () => {
      // update tennant
      await db
        .update(tennant)
        .set({
          basis: input.tennant.basis,
          name: input.tennant.name,
          regionalAuthority: input.tennant.regionalAuthority,
        })
        .where(eq(tennant.id, currentTennant.id));
      // update headDoctor
      await db
        .update(headDoctor)
        .set({
          headDoctor: input.tennant.headDoctor.headDoctor,
          headDoctorID: input.tennant.headDoctor.headDoctorID,
        })
        .where(eq(headDoctor.id, currentTennant.headDoctor.id));
      // update healthCareProvider
      await db
        .update(healthCareProvider)
        .set({
          name: input.tennant.healthCareProvider.name,
          address1: input.tennant.healthCareProvider.address1,
          address2: input.tennant.healthCareProvider.address2,
          city: input.tennant.healthCareProvider.city,
          zip: input.tennant.healthCareProvider.zip,
        })
        .where(eq(healthCareProvider.id, currentTennant.healthCareProvider.id));
      // update tennantVAT
      await db
        .update(tennantVAT)
        .set({
          VAT1: input.tennant.tennantVAT.VAT1,
          VAT2: input.tennant.tennantVAT.VAT2,
          VAT3: input.tennant.tennantVAT.VAT3,
        })
        .where(eq(tennantVAT.id, currentTennant.tennantVAT.id));
      // update tennantBankDetails
      await db
        .update(tennantBankDetails)
        .set({
          bankName: input.tennant.tennantBankDetails.bankName,
          IBAN: input.tennant.tennantBankDetails.IBAN,
          SWIFT: input.tennant.tennantBankDetails.SWIFT,
        })
        .where(eq(tennantBankDetails.id, currentTennant.tennantBankDetails.id));
    });

    const res = await this.getTennant();
    if (res) return res;
    throw new Error("Tennant not found");
  },

  async createTennant(input: { tennant: TennantInput }): Promise<Tennant> {
    const currentTennant = await db.select().from(tennant).limit(1);
    if (currentTennant.length > 0) throw new Error("Tennant already exists");

    // TRANSACTION
    await db.transaction(async () => {
      // create tennant
      await db.insert(tennant).values({
        basis: input.tennant.basis,
        name: input.tennant.name,
        regionalAuthority: input.tennant.regionalAuthority,
      });
      const createdTennant = (await db.select().from(tennant).limit(1))[0];
      if (!createdTennant) throw new Error("Error creating tennant");
      // create headDoctor
      await db.insert(headDoctor).values({
        headDoctor: input.tennant.headDoctor.headDoctor,
        headDoctorID: input.tennant.headDoctor.headDoctorID,
        tennantID: createdTennant.id,
      });
      // create healthCareProvider
      await db.insert(healthCareProvider).values({
        name: input.tennant.healthCareProvider.name,
        address1: input.tennant.healthCareProvider.address1,
        address2: input.tennant.healthCareProvider.address2,
        city: input.tennant.healthCareProvider.city,
        zip: input.tennant.healthCareProvider.zip,
        tennantID: createdTennant.id,
      });
      // create tennantVAT
      await db.insert(tennantVAT).values({
        VAT1: input.tennant.tennantVAT.VAT1,
        VAT2: input.tennant.tennantVAT.VAT2,
        VAT3: input.tennant.tennantVAT.VAT3,
        tennantID: createdTennant.id,
      });
      // create tennantBankDetails
      await db.insert(tennantBankDetails).values({
        bankName: input.tennant.tennantBankDetails.bankName,
        IBAN: input.tennant.tennantBankDetails.IBAN,
        SWIFT: input.tennant.tennantBankDetails.SWIFT,
        tennantID: createdTennant.id,
      });
    });
    return await this.getTennant();
  },
};
