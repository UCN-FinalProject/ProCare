import { TRPCError } from "@trpc/server";
import {
  type GetManyHealthCareProvidersInput,
  type CreateHealthCareProviderInput,
  type UpdateHealthCareProviderInput,
  type SetStatusHealthCareProviderInput,
  type AddDoctorInput,
  type RemoveDoctorInput,
} from "./validation/HealthCareProviderValidation";
import {
  externalHealthcareProvider,
  healthcareProviderDoctors,
} from "../db/export";
import { type TRPCContext } from "../api/trpc";
import { eq, like } from "drizzle-orm";
import type { ReturnMany } from "./validation/util";

export default {
  async getByID({ id, ctx }: { id: number; ctx: TRPCContext }) {
    const res = await ctx.db.query.externalHealthcareProvider.findFirst({
      where: (healthCareProvider, { eq }) => eq(healthCareProvider.id, id),
    });
    if (res) return res;
    throw new Error("Healthcare provider not found");
  },

  async getMany({
    input,
    ctx,
  }: {
    input: GetManyHealthCareProvidersInput;
    ctx: TRPCContext;
  }) {
    const res = await ctx.db.query.externalHealthcareProvider.findMany({
      limit: input.limit,
      offset: input.offset,
      where: findManyWhere(input),
      orderBy: (healthcareProviderDoctors, { asc }) =>
        asc(healthcareProviderDoctors.id),
    });
    const total = await ctx.db.query.externalHealthcareProvider.findMany({
      columns: { id: true },
      limit: input.limit,
      offset: input.offset,
      where: findManyWhere(input),
      orderBy: (healthcareProviderDoctors, { asc }) =>
        asc(healthcareProviderDoctors.id),
    });
    if (!res)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Healthcare providers not found",
      });
    return {
      result: res,
      offset: input.offset,
      limit: input.limit,
      total: total.length,
    } satisfies ReturnMany<typeof res>;
  },

  async create({
    input,
    ctx,
  }: {
    input: CreateHealthCareProviderInput;
    ctx: TRPCContext;
  }) {
    const create = await ctx.db
      .insert(externalHealthcareProvider)
      .values({
        name: input.name,
        healthcareProviderCode: input.healthcareProviderCode,
        VAT: input.VAT,
        address1: input.address1,
        address2: input.address2,
        city: input.city,
        zip: input.zip,
        note: input.note,
        isActive: true,
      })
      .returning();

    if (create && create.length === 1) return create[0];
    throw new Error("Healthcare provider could not be created");
  },

  async update({
    input,
    ctx,
  }: {
    input: UpdateHealthCareProviderInput;
    ctx: TRPCContext;
  }) {
    const update = await ctx.db
      .update(externalHealthcareProvider)
      .set({
        name: input.name,
        healthcareProviderCode: input.healthcareProviderCode,
        VAT: input.VAT,
        address1: input.address1,
        address2: input.address2 ?? null,
        city: input.city,
        zip: input.zip,
        note: input.note ?? null,
      })
      .where(eq(externalHealthcareProvider.id, input.id))
      .returning();

    if (update && update.length === 1) return update[0];
    throw new Error("Healthcare provider could not be updated");
  },

  async setStatus({
    input,
    ctx,
  }: {
    input: SetStatusHealthCareProviderInput;
    ctx: TRPCContext;
  }) {
    const update = await ctx.db
      .update(externalHealthcareProvider)
      .set({
        isActive: input.isActive,
      })
      .where(eq(externalHealthcareProvider.id, input.id))
      .returning();

    if (update && update.length === 1) return update[0];
    throw new Error("Healthcare provider could not be updated");
  },

  async getDoctors({ id, ctx }: { id: number; ctx: TRPCContext }) {
    const res = await ctx.db.query.healthcareProviderDoctors.findMany({
      where: (healthCareProviderDoctor, { eq }) =>
        eq(healthCareProviderDoctor.healthcareProviderID, id),
      orderBy: (healthcareProviderDoctors, { asc }) =>
        asc(healthcareProviderDoctors.id),
      with: { doctors: true },
    });
    const total = await ctx.db.query.healthcareProviderDoctors.findMany({
      where: (healthCareProviderDoctor, { eq }) =>
        eq(healthCareProviderDoctor.healthcareProviderID, id),
      orderBy: (healthcareProviderDoctors, { asc }) =>
        asc(healthcareProviderDoctors.id),
      columns: { id: true },
    });

    const doctors = res.map((doctor) => {
      return {
        id: doctor.doctors.id,
        fullName: doctor.doctors.fullName,
        note: doctor.doctors.note,
        isActive: doctor.doctors.isActive,
        doctorID: doctor.doctors.doctorID,
      };
    });

    // TODO: implement pagination
    if (res && doctors)
      return {
        limit: 0,
        offset: 0,
        total: total.length,
        result: doctors,
      } satisfies ReturnMany<typeof doctors>;
    throw new Error("Doctors not found");
  },

  async addDoctor({ input, ctx }: { input: AddDoctorInput; ctx: TRPCContext }) {
    const doctor = await ctx.db.query.healthcareProviderDoctors.findFirst({
      where: (healthcareProviderDoctors, { eq }) =>
        eq(
          healthcareProviderDoctors.healthcareProviderID,
          input.healthcareProviderID,
        ) && eq(healthcareProviderDoctors.doctorID, input.doctorID),
    });
    if (doctor)
      throw new Error("Doctor is already added to this healthcare provider.");

    const addedDoctor = await ctx.db
      .insert(healthcareProviderDoctors)
      .values({
        healthcareProviderID: input.healthcareProviderID,
        doctorID: input.doctorID,
        createdBy: ctx.session!.user.id,
      })
      .returning();
    if (addedDoctor && addedDoctor.length === 1) return addedDoctor[0];
    throw new Error("Doctor could not be added");
  },

  async removeDoctor({
    input,
    ctx,
  }: {
    input: RemoveDoctorInput;
    ctx: TRPCContext;
  }) {
    const removedDoctor = await ctx.db
      .delete(healthcareProviderDoctors)
      .where(
        eq(
          healthcareProviderDoctors.healthcareProviderID,
          input.healthcareProviderID,
        ) && eq(healthcareProviderDoctors.doctorID, input.doctorID),
      )
      .returning();
    if (removedDoctor && removedDoctor.length === 1) return removedDoctor[0];
    throw new Error("Doctor could not be removed");
  },
} as const;

const findManyWhere = (input: GetManyHealthCareProvidersInput) => {
  let where = undefined;
  if (input.isActive !== undefined)
    where = eq(externalHealthcareProvider.isActive, input.isActive);
  if (input.name !== undefined)
    where = like(externalHealthcareProvider.name, `%${input.name}%`);
  if (input.providerId !== undefined)
    where = like(
      externalHealthcareProvider.healthcareProviderCode,
      `%${input.providerId}%`,
    );
  return where;
};
