import { TRPCContext } from "../api/trpc";
import { TRPCError } from "@trpc/server";
import {
  healthInsurance,
  patient,
  patientConditions,
  patientProcedure,
} from "../db/export";
import { asc, eq } from "drizzle-orm";
import {
  GetPatientInput,
  CreatePatientInput,
  UpdatePatientInput,
  AddPatientConditionInput,
  AddPatientProcedureInput,
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
      input.patientConditions?.forEach(async (condition) => {
        await tx.insert(patientConditions).values({
          conditionID: condition.conditionID,
          patientID: condition.patientID,
        });
      });
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

  async addPatientProcedure({
    input,
    ctx,
  }: {
    input: AddPatientProcedureInput;
    ctx: TRPCContext;
  }) {
    const insert = await ctx.db
      .insert(patientProcedure)
      .values({
        patientID: input.patientID,
        procedureID: input.procedureID,
        date: input.date,
        doctorName: input.doctorName,
        doctorID: input.doctorID,
      })
      .returning({ id: patientProcedure.id });
    if (insert.length !== 1 && !insert.at(0)?.id)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Procedure could not be added to patient.",
      });
  },
  //POSSIBLE methods to consider: getPatientsByCity, getPatientsByConditions
};
