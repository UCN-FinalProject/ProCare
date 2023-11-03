import { z } from "zod";

export const getHealthInsurancesInput = z.object({
  limit: z.number(),
  offset: z.number(),
});
export type GetHealthInsurancesInput = z.infer<typeof getHealthInsurancesInput>;

export const createHealthInsuranceInput = z.object({
  // id: z.number(),
  insuranceID: z.number(),
  registeredID: z.number(),
  name: z.string(),
  pricePerCredit: z.string(),
  address: z.object({
    address1: z.string(),
    address2: z.string().optional().nullable(),
    city: z.string(),
    zip: z.string(),
    phoneNumber: z.string().optional().nullable(),
    email: z.string().nullable().optional(),
  }),
  vat: z.object({
    VAT1: z.string(),
    VAT2: z.string(),
    VAT3: z.string().optional().nullable(),
  }),
});
export type HealthInsuranceInput = z.infer<typeof createHealthInsuranceInput>;

export const updateHealthInsuranceInput = z.object({
  id: z.number(),
  insuranceID: z.number(),
  registeredID: z.number(),
  name: z.string(),
  pricePerCredit: z.number(),
  address: z.object({
    address1: z.string(),
    address2: z.string().optional().nullable(),
    city: z.string(),
    zip: z.string(),
    phoneNumber: z.string().optional().nullable(),
    email: z.string().nullable().optional(),
  }),
  vat: z.object({
    VAT1: z.string(),
    VAT2: z.string(),
    VAT3: z.string().optional().nullable(),
  }),
});
export type UpdateHealthInsuranceInput = z.infer<
  typeof updateHealthInsuranceInput
>;
