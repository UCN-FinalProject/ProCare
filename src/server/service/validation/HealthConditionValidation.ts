import { z } from "zod";

// get many
export const getManyHealthConditionsInput = z.object({
  limit: z.number(),
  offset: z.number(),
});
export type GetManyHealthConditionsInput = z.infer<
  typeof getManyHealthConditionsInput
>;

// create
export const createHealthConditionInput = z.object({
  name: z.string(),
  description: z.string(),
});
export type CreateHealthConditionInput = z.infer<
  typeof createHealthConditionInput
>;

// update
export const updateHealthConditionInput = z.object({
  id: z.number(),
  ...createHealthConditionInput.shape,
});
export type UpdateHealthConditionInput = z.infer<
  typeof updateHealthConditionInput
>;
