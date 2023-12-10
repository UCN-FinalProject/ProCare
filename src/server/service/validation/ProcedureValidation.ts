import z from "zod";

export const getManyProceduresInput = z.object({
  limit: z.number(),
  offset: z.number(),
});
export type GetManyProceduresInput = z.infer<typeof getManyProceduresInput>;

export const createProcedureInput = z.object({
  name: z.string(),
});
export type CreateProcedureInput = z.infer<typeof createProcedureInput>;

export const updateProcedureInput = z.object({
  id: z.number(),
  name: z.string(),
});
export type UpdateProcedureInput = z.infer<typeof updateProcedureInput>;

export const createProcedurePricingWithoutProcedureID = z.object({
  healthInsuranceId: z.number(),
  credits: z.number(),
  price: z.string(),
});
export type CreateProcedurePricingWithoutProcedureID = Omit<
  CreateProcedurePricingInput,
  "procedureId"
>;

export const createProcedurePricingInput = z.object({
  ...createProcedurePricingWithoutProcedureID.shape,
  procedureId: z.number(),
});
export type CreateProcedurePricingInput = z.infer<
  typeof createProcedurePricingInput
>;
