import { z } from "zod";

const disabilities = [
  "limited_physical",
  "physical",
  "mental",
  "none",
] as const;

export const getPatientsInput = z.object({
  limit: z.number(),
  offset: z.number(),
  isActive: z.boolean().optional(),
  name: z.string().optional(),
});
export type GetPatientsInput = z.infer<typeof getPatientsInput>;

export const createPatientInput = z.object({
  fullName: z.string(),
  isActive: z.boolean(),
  biologicalSex: z.enum(["male", "female"]),
  dateOfBirth: z.date(),
  ssn: z.string(),
  recommendationDate: z.date().optional(),
  acceptanceDate: z.date().optional(),
  startDate: z.date(),
  expectedEndOfTreatment: z.date(),
  endDate: z.date().optional(),
  insuredID: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  disability: z.enum(disabilities),
  alergies: z.string().optional(),
  note: z.string().optional(),
  // address
  address1: z.string(),
  address2: z.string().optional(),
  city: z.string(),
  zip: z.string(),
  // healthcare info
  healthInsuranceID: z.number(),
  doctorID: z.number(),
  healthcareProviderID: z.number(),
  // conditions
  conditions: z
    .array(
      z.object({
        conditionID: z.number(),
      }),
    )
    .optional(),
});
export type CreatePatientInput = z.infer<typeof createPatientInput>;

export const updatePatientInput = z.object({
  id: z.string(),
  fullName: z.string(),
  recommendationDate: z.date().optional(),
  acceptanceDate: z.date().optional(),
  expectedEndOfTreatment: z.date(),
  insuredID: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  disability: z.enum(disabilities),
  alergies: z.string().optional(),
  note: z.string().optional(),
  // address
  address1: z.string(),
  address2: z.string().optional(),
  city: z.string(),
  zip: z.string(),
  // healthcare info
  healthInsuranceID: z.number(),
  doctorID: z.number(),
  healthcareProviderID: z.number(),
});
export type UpdatePatientInput = z.infer<typeof updatePatientInput>;

export const addPatientConditionInput = z.object({
  patientID: z.string(),
  conditionID: z.number(),
  assignedByID: z.string(),
});
export type AddPatientConditionInput = z.infer<typeof addPatientConditionInput>;

export const setStatusPatientInput = z.object({
  id: z.string(),
  isActive: z.boolean(),
});
export type SetStatusPatientInput = z.infer<typeof setStatusPatientInput>;
export const addPatientProcedureInput = z.object({
  patientID: z.string(),
  procedureID: z.number(),
});
export type AddPatientProcedureInput = z.infer<typeof addPatientProcedureInput>;
