import { z } from "zod";

export const getPatientInput = z.object({
  name: z.string(),
  address: z.string().optional(),
});
export type GetPatientInput = z.infer<typeof getPatientInput>;

export const createPatientInput = z.object({
  fullName: z.string(),
  address: z.string(),
  personalDoctorID: z.number(), // do we want these as optinal? maybe you link them afterwards?
  healthInsuranceID: z.number(),
  patientConditions: z
    .array(
      z.object({
        conditionID: z.number(),
      }),
    )
    .optional(),
});
export type CreatePatientInput = z.infer<typeof createPatientInput>;

export const updatePatientInput = z.object({
  id: z.number(),
  fullName: z.string(),
  address: z.string(),
  personalDoctorID: z.number(), // do we want these as optinal? maybe you link them afterwards?
  healthInsuranceID: z.number(),
});
export type UpdatePatientInput = z.infer<typeof updatePatientInput>;

export const addPatientCondition = z.object({
  patientID: z.number(),
  conditionID: z.number(),
});
export type AddPatientConditionInput = z.infer<typeof addPatientCondition>;

export const addPatientProcedure = z.object({
  patientID: z.number(),
  procedureID: z.number(),
  date: z.date(),
  doctorName: z.string(),
  doctorID: z.number(),
});
export type AddPatientProcedureInput = z.infer<typeof addPatientProcedure>;
