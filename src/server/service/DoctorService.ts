import {
  type GetManyDoctorsInput,
  type CreateDoctorInput,
  type UpdateDoctorInput,
  type SetStatusDoctorInput,
  type AddDoctorInput,
  type RemoveDoctorInput,
} from "./validation/DoctorValidation";
import { asc, eq, like } from "drizzle-orm";
import { doctor, healthcareProviderDoctors } from "../db/export";
import { type TRPCContext } from "../api/trpc";
import type { ReturnMany } from "./validation/util";

export default {
  async getByID({ id, ctx }: { id: number; ctx: TRPCContext }) {
    const res = await ctx.db.query.doctor.findFirst({
      where: (doctor, { eq }) => eq(doctor.id, id),
    });
    if (res) return res;
    throw new Error("Doctor not found.");
  },

  async getMany({
    input,
    ctx,
  }: {
    input: GetManyDoctorsInput;
    ctx: TRPCContext;
  }) {
    const res = await ctx.db.query.doctor.findMany({
      limit: input.limit,
      offset: input.offset,
      where: findManyWhere(input),
      orderBy: [asc(doctor.id)],
    });
    const total = await ctx.db.query.doctor.findMany({
      columns: { id: true },
      limit: input.limit,
      offset: input.offset,
      where: findManyWhere(input),
      orderBy: [asc(doctor.id)],
    });

    if (res)
      return {
        result: res,
        offset: input.offset,
        limit: input.limit,
        total: total.length,
      } satisfies ReturnMany<typeof res>;
    throw new Error("Doctors not found.");
  },

  async create({ input, ctx }: { input: CreateDoctorInput; ctx: TRPCContext }) {
    const create = await ctx.db
      .insert(doctor)
      .values({
        fullName: input.fullName,
        doctorID: input.doctorID,
        note: input.note,
      })
      .returning();

    if (create && create.length === 1) return create[0];
    throw new Error("Doctor could not be created.");
  },

  async update({ input, ctx }: { input: UpdateDoctorInput; ctx: TRPCContext }) {
    const update = await ctx.db
      .update(doctor)
      .set({
        fullName: input.fullName,
        doctorID: input.doctorID,
        note: input.note,
      })
      .where(eq(doctor.id, input.id))
      .returning();

    if (update && update.length === 1) return update[0];
    throw new Error("Doctor could not be updated.");
  },

  async setStatus({
    input,
    ctx,
  }: {
    input: SetStatusDoctorInput;
    ctx: TRPCContext;
  }) {
    const update = await ctx.db
      .update(doctor)
      .set({
        isActive: input.isActive,
      })
      .where(eq(doctor.id, input.id))
      .returning();

    if (update && update.length === 1) return update[0];
    throw new Error("Doctor could not be updated.");
  },

  // TODO: test and improve return structure
  async getHealthCareProviders({ id, ctx }: { id: number; ctx: TRPCContext }) {
    const res = await ctx.db.query.healthcareProviderDoctors.findMany({
      where: (healthcareProviderDoctors, { eq }) =>
        eq(healthcareProviderDoctors.doctorID, id),
      orderBy: [asc(healthcareProviderDoctors.id)],
      with: {
        healthcareProviders: true,
      },
    });
    if (res) return res;
    throw new Error("Healthcare providers not found.");
  },

  async addHealthCareProvider({
    input,
    ctx,
  }: {
    input: AddDoctorInput;
    ctx: TRPCContext;
  }) {
    const provider = await ctx.db.query.healthcareProviderDoctors.findFirst({
      where: (healthcareProviderDoctors, { eq }) =>
        eq(
          healthcareProviderDoctors.healthcareProviderID,
          input.healthcareProviderID,
        ) && eq(healthcareProviderDoctors.doctorID, input.doctorID),
    });
    if (provider) throw new Error("Healthcare provider already added");

    const create = await ctx.db
      .insert(healthcareProviderDoctors)
      .values({
        healthcareProviderID: input.healthcareProviderID,
        doctorID: input.doctorID,
        createdBy: ctx.session!.user.id,
      })
      .returning();

    if (create && create.length === 1) return create[0];
    throw new Error("Healthcare provider could not be created.");
  },

  async removeHealthCareProvider({
    input,
    ctx,
  }: {
    input: RemoveDoctorInput;
    ctx: TRPCContext;
  }) {
    const removed = await ctx.db
      .delete(healthcareProviderDoctors)
      .where(
        eq(healthcareProviderDoctors.doctorID, input.doctorID) &&
          eq(
            healthcareProviderDoctors.healthcareProviderID,
            input.healthcareProviderID,
          ),
      )
      .returning();

    if (removed && removed.length === 1) return removed[0];
    throw new Error("Healthcare provider could not be removed.");
  },
} as const;

const findManyWhere = (input: GetManyDoctorsInput) => {
  let where = undefined;
  if (input.isActive !== undefined) where = eq(doctor.isActive, input.isActive);
  if (input.name !== undefined)
    where = like(doctor.fullName, `%${input.name}%`);
  if (input.doctorID !== undefined)
    where = like(doctor.doctorID, `%${input.doctorID}%`);
  return where;
};
