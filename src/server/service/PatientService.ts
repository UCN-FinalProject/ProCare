import { TRPCContext } from "../api/trpc";
import { TRPCError } from "@trpc/server";
import { patient, patientConditions, patientProcedure } from "../db/export";
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
  async getByNameAndAddress({
    input,
    ctx,
  }: {
    input: GetPatientInput;
    ctx: TRPCContext;
  }) {},
  async getByDoctorID({ id, ctx }: { id: number; ctx: TRPCContext }) {
    const res = await ctx.db.query.patient.findMany({
      where: (patient, { eq }) => eq(patient.personalDoctorID, id),
    });
    if (res) return res;
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No patients found for provided doctor ID: " + id,
    });
  },

  async getByHealthInsuranceID({ id, ctx }: { id: number; ctx: TRPCContext }) {
    const res = await ctx.db.query.patient.findMany({
      where: (patient, { eq }) => eq(patient.healthInsuranceID, id),
    });
    if (res) return res;
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No patients found for health insurance ID: " + id,
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
  }) {},

  async addPatientCondition({
    input,
    ctx,
  }: {
    input: AddPatientConditionInput;
    ctx: TRPCContext;
  }) {
    const transaction = await ctx.db.transaction(async (tx) => {
      const insert = await tx.insert(patientConditions).values({
        patientID: input.patientID,
        conditionID: input.conditionID,
      });
    });
  },

  async addPatientProcedure({
    input,
    ctx,
  }: {
    input: AddPatientProcedureInput;
    ctx: TRPCContext;
  }) {
    const insert = await ctx.db.insert(patientProcedure).values({
      patientID: input.patientID,
      procedureID: input.procedureID,
      date: input.date,
      doctorName: input.doctorName,
      doctorID: input.doctorID,
    });
  },
  //POSSIBLE methods to consider: getPatientsByCity, getPatientsByConditions
};
