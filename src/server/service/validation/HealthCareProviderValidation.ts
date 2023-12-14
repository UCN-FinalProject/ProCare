import { z } from "zod";

export const getManyHealthCareProvidersInput = z.object({
  limit: z.number(),
  offset: z.number(),
  isActive: z.boolean().optional(),
  name: z.string().optional(),
  providerId: z.string().optional(),
});
export type GetManyHealthCareProvidersInput = z.infer<
  typeof getManyHealthCareProvidersInput
>;

export const createHealthCareProviderInput = z.object({
  name: z.string(),
  healthcareProviderCode: z.string(),
  VAT: z.string(),
  address1: z.string(),
  address2: z.string().optional(),
  city: z.string(),
  zip: z.string(),
  note: z.string().optional(),
});
export type CreateHealthCareProviderInput = z.infer<
  typeof createHealthCareProviderInput
>;

export const updateHealthCareProviderInput = z.object({
  id: z.number(),
  ...createHealthCareProviderInput.shape,
});
export type UpdateHealthCareProviderInput = z.infer<
  typeof updateHealthCareProviderInput
>;

export const setStatusHealthCareProviderInput = z.object({
  id: z.number(),
  isActive: z.boolean(),
});
export type SetStatusHealthCareProviderInput = z.infer<
  typeof setStatusHealthCareProviderInput
>;

export const addDoctorInput = z.object({
  healthcareProviderID: z.number(),
  doctorID: z.number(),
});
export type AddDoctorInput = z.infer<typeof addDoctorInput>;

export const removeDoctorInput = addDoctorInput;
export type RemoveDoctorInput = z.infer<typeof removeDoctorInput>;
