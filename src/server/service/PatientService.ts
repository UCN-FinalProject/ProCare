import { type TRPCContext } from "../api/trpc";
import { TRPCError } from "@trpc/server";
import { patient, patientConditions } from "../db/export";
import { eq } from "drizzle-orm";
import {
  type CreatePatientInput,
  type UpdatePatientInput,
  type AddPatientConditionInput,
} from "./validation/PatientValidation";

export default {
  async getByPatientID({ id, ctx }: { id: number; ctx: TRPCContext }) {
    const res = await ctx.db.query.patient.findFirst({
      where: (patient, { eq }) => eq(patient.id, id),
    });
    if (res) return res;
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No patient was found for provided ID: " + id,
    });
  },

  async getMany({ ctx }: { ctx: TRPCContext }) {
    const res = await ctx.db.query.patient.findMany();
    if (res) return res;
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
      const insert = await tx
        .insert(patient)
        .values({
          fullName: input.fullName,
          address: input.address,
          healthInsuranceID: input.healthInsuranceID,
          personalDoctorID: input.personalDoctorID,
        })
        .returning({ id: patient.id })
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
          message: "Patient could not be created",
        });

      if (input.patientConditions && input.patientConditions.length > 0) {
        for (const condition of input.patientConditions) {
          await tx.insert(patientConditions).values({
            conditionID: condition.conditionID,
            patientID: insert.at(0)!.id,
          });
        }
      }

      return tx.query.patient.findFirst({
        where: (patient, { eq }) => eq(patient.id, insert.at(0)!.id),
        with: {
          conditions: true,
          doctor: true,
          healthInsurance: true,
        },
      });
    });

    if (transaction) return transaction;

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Patient could not be created",
    });
  },

  async updatePatient({
    input,
    ctx,
  }: {
    input: UpdatePatientInput;
    ctx: TRPCContext;
  }) {
    const update = await ctx.db
      .update(patient)
      .set({
        fullName: input.fullName,
        address: input.address,
        personalDoctorID: input.personalDoctorID,
        healthInsuranceID: input.healthInsuranceID,
      })
      .where(eq(patient.id, input.id));
    if (update.rowCount < 1)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Patient could not be updated",
      });
    return this.getByPatientID({ id: input.id, ctx });
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
        message: "Condition could not be added to patient.",
      });
  },
} as const;
