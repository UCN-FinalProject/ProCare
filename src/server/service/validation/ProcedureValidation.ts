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

export const createProcedurePricingInput = z.object({
  procedureId: z.number(),
  healthInsuranceId: z.number(),
  credits: z.number(),
  price: z.string(),
});
export type CreateProcedurePricingInput = z.infer<
  typeof createProcedurePricingInput
>;

export const updateProcedurePricingInput = z.object({
  id: z.number(),
  procedureId: z.number(),
  healthInsuranceId: z.number(),
  credits: z.number(),
  price: z.string(),
});
export type UpdateProcedurePricingInput = z.infer<
  typeof updateProcedurePricingInput
>;
