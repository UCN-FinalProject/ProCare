import z from "zod";

export const getManyDoctorsInput = z.object({
  limit: z.number(),
  offset: z.number(),
  isActive: z.boolean().optional(),
});
export type GetManyDoctorsInput = z.infer<typeof getManyDoctorsInput>;

export const createDoctorInput = z.object({
  fullName: z.string(),
  doctorID: z.string(),
  note: z.string().optional(),
});
export type CreateDoctorInput = z.infer<typeof createDoctorInput>;

export const updateDoctorInput = z.object({
  id: z.number(),
  ...createDoctorInput.shape,
});
export type UpdateDoctorInput = z.infer<typeof updateDoctorInput>;

export const setStatusDoctorInput = z.object({
  id: z.number(),
  isActive: z.boolean(),
});
export type SetStatusDoctorInput = z.infer<typeof setStatusDoctorInput>;

export const addDoctorInput = z.object({
  healthcareProviderID: z.number(),
  doctorID: z.number(),
});
export type AddDoctorInput = z.infer<typeof addDoctorInput>;

export const removeDoctorInput = addDoctorInput;
export type RemoveDoctorInput = z.infer<typeof removeDoctorInput>;
