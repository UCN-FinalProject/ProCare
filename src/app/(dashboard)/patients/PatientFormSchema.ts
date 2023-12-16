import { z } from "zod";
import { disabilities, biologicalSexValues } from "~/server/db/export";

export const patientFormSchema = z.object({
  fullName: z.string().min(1, {
    message: "Full name cannot be empty.",
  }),
  biologicalSex: z.enum(biologicalSexValues),
  dateOfBirth: z.date(),
  ssn: z.string(),
  recommendationDate: z.date(),
  acceptanceDate: z.date().optional(),
  startDate: z.date(),
  expectedEndOfTreatment: z.date(),
  endDate: z.date().optional(),
  insuredID: z.string().min(1, {
    message: "Patient's insured id is required..",
  }),
  email: z.string().optional(),
  phone: z.string().optional(),
  disability: z.enum(disabilities),
  alergies: z.string().optional(),
  note: z.string().optional(),
  // address
  address1: z.string().min(1, {
    message: "Patient must have main address.",
  }),
  address2: z.string().optional(),
  city: z.string().min(1, {
    message: "Patient must contain city.",
  }),
  zip: z.string().min(1, {
    message: "Zip code is required.",
  }),
  // healthcare info
  healthInsuranceID: z.coerce.number().min(1, {
    message: "Patient's health insurance id is required",
  }),
  doctorID: z.coerce.number().min(1, {
    message: "Patient's personal doctor's id is required.",
  }),
  healthcareProviderID: z.coerce.number().min(1, {
    message: "ID of the health insurance provider is required.",
  }),
});
