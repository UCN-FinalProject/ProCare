import { z } from "zod";

export const tennantInput = z.object({
  name: z.string().min(1),
  basis: z.string().min(1),
  regionalAuthority: z.string().min(1),
  headDoctor: z.object({
    headDoctor: z.string().min(1),
    headDoctorID: z.string().min(1),
  }),
  healthCareProvider: z.object({
    name: z.string().min(1),
    address1: z.string().min(1),
    address2: z.string().optional(),
    city: z.string().min(1),
    zip: z.string().min(1),
  }),
  tennantBankDetails: z.object({
    bankName: z.string().min(1),
    SWIFT: z.string().min(1),
    IBAN: z.string().min(1),
  }),
  tennantVAT: z.object({
    VAT1: z.string().min(1),
    VAT2: z.string().min(1),
    VAT3: z.string().optional(),
  }),
});

export type TennantInput = z.infer<typeof tennantInput>;
