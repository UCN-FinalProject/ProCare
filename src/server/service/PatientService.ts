import { type TRPCContext } from "../api/trpc";
import { TRPCError } from "@trpc/server";
import {
  patient,
  patientAddress,
  patientConditions,
  patientHealthcareInfo,
} from "../db/export";
import { asc, eq } from "drizzle-orm";
import {
  type CreatePatientInput,
  type UpdatePatientInput,
  type AddPatientConditionInput,
  type GetPatientsInput,
  type SetStatusPatientInput,
} from "./validation/PatientValidation";

export default {
  async getByPatientID({ id, ctx }: { id: string; ctx: TRPCContext }) {
    const res = await ctx.db.query.patient.findFirst({
      where: (patient, { eq }) => eq(patient.id, id),
      with: {
        conditions: true,
        address: true,
        healthcareInfo: true,
      },
    });
    if (res) return res;
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No patient was found.",
    });
  },

  async getMany({ input, ctx }: { input: GetPatientsInput; ctx: TRPCContext }) {
    const res = await ctx.db.query.patient.findMany({
      limit: input.limit,
      offset: input.offset,
      with: {
        address: true,
        healthcareInfo: true,
      },
      where: (patient, { eq }) =>
        input.isActive !== undefined
          ? eq(patient.isActive, input.isActive)
          : undefined,
      orderBy: [asc(patient.id)],
    });
    const total = await ctx.db.query.patient.findMany({
      columns: { id: true },
      where: (patient, { eq }) =>
        input.isActive !== undefined
          ? eq(patient.isActive, input.isActive)
          : undefined,
    });
    if (res)
      return {
        result: res,
        offset: input.offset,
        limit: input.limit,
        total: total.length,
      };
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No patients were found.",
    });
  },

  async createPatient({
    input,
    ctx,
  }: {
    input: CreatePatientInput;
    ctx: TRPCContext;
  }) {
    const transaction = await ctx.db.transaction(async (tx) => {
      const patientInsert = await tx
        .insert(patient)
        .values({
          fullName: input.fullName,
          isActive: input.isActive,
          biologicalSex: input.biologicalSex,
          dateOfBirth: input.dateOfBirth,
          ssn: input.ssn,
          recommendationDate: input.recommendationDate ?? null,
          acceptanceDate: input.acceptanceDate ?? null,
          startDate: input.startDate,
          expectedEndOfTreatment: input.expectedEndOfTreatment,
          endDate: input.endDate ?? null,
          insuredID: input.insuredID,
          email: input.email ?? null,
          phone: input.phone ?? null,
          disability: input.disability,
          alergies: input.alergies ?? null,
          note: input.note ?? null,
        })
        .returning()
        .catch((err) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: String(err),
          });
        });

      if (!patientInsert[0])
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Patient could not be created.",
        });

      const newUserID = patientInsert[0].id;

      await tx
        .insert(patientAddress)
        .values({
          patientID: newUserID,
          address1: input.address1,
          address2: input.address2 ?? null,
          city: input.city,
          zipCode: input.zip,
        })
        .catch((err) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: String(err),
          });
        });

      await tx
        .insert(patientHealthcareInfo)
        .values({
          patientID: newUserID,
          healthInsuranceID: input.healthInsuranceID,
          doctorID: input.doctorID,
          healthcareProviderID: input.healthcareProviderID,
        })
        .catch((err) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: String(err),
          });
        });

      return await tx.query.patient.findFirst({
        where: (patient, { eq }) => eq(patient.id, patientInsert.at(0)!.id),
        with: {
          conditions: true,
          address: true,
          healthcareInfo: true,
        },
      });
    });

    if (transaction) return transaction;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Patient could not be created.",
    });
  },

  async updatePatient({
    input,
    ctx,
  }: {
    input: UpdatePatientInput;
    ctx: TRPCContext;
  }) {
    const transaction = await ctx.db.transaction(async (tx) => {
      await tx
        .update(patient)
        .set({
          fullName: input.fullName,
          recommendationDate: input.recommendationDate ?? null,
          acceptanceDate: input.acceptanceDate ?? null,
          expectedEndOfTreatment: input.expectedEndOfTreatment,
          insuredID: input.insuredID,
          email: input.email ?? null,
          phone: input.phone ?? null,
          disability: input.disability,
          alergies: input.alergies ?? null,
          note: input.note ?? null,
        })
        .where(eq(patient.id, input.id))
        .catch((err) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: String(err),
          });
        });

      await tx
        .update(patientAddress)
        .set({
          address1: input.address1,
          address2: input.address2 ?? null,
          city: input.city,
          zipCode: input.zip,
        })
        .where(eq(patientAddress.patientID, input.id))
        .catch((err) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: String(err),
          });
        });

      await tx
        .update(patientHealthcareInfo)
        .set({
          healthInsuranceID: input.healthInsuranceID,
          doctorID: input.doctorID,
          healthcareProviderID: input.healthcareProviderID,
        })
        .where(eq(patientHealthcareInfo.patientID, input.id))
        .catch((err) => {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: String(err),
          });
        });

      return await tx.query.patient.findFirst({
        where: (patient, { eq }) => eq(patient.id, input.id),
        with: {
          conditions: true,
          address: true,
          healthcareInfo: true,
        },
      });
    });

    if (transaction) return transaction;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Patient could not be updated.",
    });
  },

  async setStatus({
    input,
    ctx,
  }: {
    input: SetStatusPatientInput;
    ctx: TRPCContext;
  }) {
    const update = await ctx.db
      .update(patient)
      .set({
        isActive: input.isActive,
      })
      .where(eq(patient.id, input.id))
      .returning()
      .catch((error) => {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : String(error),
        });
      });
    if (update) return update;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Patient could not be updated",
    });
  },

  async addPatientCondition({
    input,
    ctx,
  }: {
    input: AddPatientConditionInput;
    ctx: TRPCContext;
  }) {
    const insert = await ctx.db
      .insert(patientConditions)
      .values({
        patientID: input.patientID,
        conditionID: input.conditionID,
      })
      .returning({ id: patientConditions.id });

    if (insert.length !== 1 && !insert.at(0)?.id)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Condition could not be added.",
      });
  },
} as const;
