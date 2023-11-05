import { z } from "zod";

export const getManyHealthCareProvidersInput = z.object({
  limit: z.number(),
  offset: z.number(),
  isActive: z.boolean().optional(),
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
