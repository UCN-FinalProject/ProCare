import z from "zod";

export const createUserInput = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  role: z.enum(["admin", "user"]),
  doctorID: z.string().optional(),
});
export type CreateUserInput = z.infer<typeof createUserInput>;

export const updateUserInput = z.object({
  id: z.string().min(1).uuid(),
  name: z.string().min(1),
  role: z.enum(["admin", "user"]),
  doctorID: z.string().optional(),
});
export type UpdateUserInput = z.infer<typeof updateUserInput>;
