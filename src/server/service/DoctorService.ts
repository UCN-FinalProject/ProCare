import type {
  GetManyDoctorsInput,
  CreateDoctorInput,
  UpdateDoctorInput,
  SetStatusDoctorInput,
  AddDoctorInput,
  RemoveDoctorInput,
  GetDoctorPatientsInput,
  SearchDoctorsInput,
} from "./validation/DoctorValidation";
import { doctor, healthcareProviderDoctors } from "../db/export";
import { type TRPCContext } from "../api/trpc";
import type { ReturnMany } from "./validation/util";
import { and, eq, like } from "drizzle-orm";

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
      orderBy: (doctor, { asc }) => asc(doctor.id),
    });
    const total = await ctx.db.query.doctor.findMany({
      columns: { id: true },
      limit: input.limit,
      offset: input.offset,
      where: findManyWhere(input),
      orderBy: (doctor, { asc }) => asc(doctor.id),
    });
    console.log(res);

    if (res)
      return {
        result: res,
        offset: input.offset,
        limit: input.limit,
        total: total.length,
      } satisfies ReturnMany<typeof res>;
    throw new Error("Doctors not found.");
  },

  async searchDoctors({
    input,
    ctx,
  }: {
    input: SearchDoctorsInput;
    ctx: TRPCContext;
  }) {
    const res = await ctx.db.query.healthcareProviderDoctors.findMany({
      with: {
        doctors: {
          columns: {
            id: true,
            fullName: true,
          },
        },
      },
      where: (healthcareProviderDoctors, { eq }) => {
        if (!input.healthCareProviderID) return;
        return eq(
          healthcareProviderDoctors.healthcareProviderID,
          input.healthCareProviderID,
        );
      },
    });
    const doctors = res.map((doctor) => doctor.doctors);

    if (res) return { result: doctors };
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

  async getHealthCareProviders({ id, ctx }: { id: number; ctx: TRPCContext }) {
    const res = await ctx.db.query.healthcareProviderDoctors.findMany({
      where: (healthcareProviderDoctors, { eq }) =>
        eq(healthcareProviderDoctors.doctorID, id),
      orderBy: (healthcareProviderDoctors, { asc }) =>
        asc(healthcareProviderDoctors.id),
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

  async getPatients({
    input,
    ctx,
  }: {
    input: GetDoctorPatientsInput;
    ctx: TRPCContext;
  }) {
    const res = await ctx.db.query.patientHealthcareInfo.findMany({
      where: (patient, { eq }) => eq(patient.doctorID, input.doctorID),
      orderBy: (patient, { asc }) => asc(patient.id),
      limit: input.limit,
      offset: input.offset,
      with: {
        patient: true,
      },
    });
    const total = await ctx.db.query.patientHealthcareInfo.findMany({
      columns: { id: true },
      where: (patient, { eq }) => eq(patient.doctorID, input.doctorID),
      orderBy: (patient, { asc }) => asc(patient.id),
    });

    const patients = res.map((patient) => patient.patient);

    if (res)
      return {
        result: patients,
        offset: input.offset,
        limit: input.limit,
        total: total.length,
      } satisfies ReturnMany<typeof patients>;
    throw new Error("Patients not found.");
  },
} as const;

function findManyWhere(input: GetManyDoctorsInput) {
  return and(
    input.isActive !== undefined
      ? eq(doctor.isActive, input.isActive)
      : undefined,
    input.name !== undefined
      ? like(doctor.fullName, `%${input.name}%`)
      : undefined,
    input.doctorID !== undefined
      ? like(doctor.doctorID, `%${input.doctorID}%`)
      : undefined,
  );
}
