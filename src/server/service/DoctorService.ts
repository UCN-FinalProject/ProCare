import { TRPCError } from "@trpc/server";
import { db } from "../db";
import {
  type GetManyDoctorsInput,
  type CreateDoctorInput,
  type UpdateDoctorInput,
  type SetStatusDoctorInput,
  type AddDoctorInput,
  type RemoveDoctorInput,
} from "./validation/DoctorValidation";
import { asc, eq } from "drizzle-orm";
import { doctor, healthcareProviderDoctors } from "../db/export";

export default {
  async getByID(id: number) {
    const res = await db.query.doctor.findFirst({
      where: (doctor, { eq }) => eq(doctor.id, id),
    });
    if (res) return res;
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Doctor not found",
    });
  },

  async getMany(input: GetManyDoctorsInput) {
    const res = await db.query.doctor.findMany({
      limit: input.limit,
      offset: input.offset,
      where: (doctor, { eq }) =>
        input.isActive !== undefined
          ? eq(doctor.isActive, input.isActive)
          : undefined,
      orderBy: [asc(doctor.id)],
    });
    const total = await db.query.doctor.findMany({
      columns: { id: true },
      where: (doctor, { eq }) =>
        input.isActive !== undefined
          ? eq(doctor.isActive, input.isActive)
          : undefined,
    });

    if (res)
      return {
        result: res,
        offset: input.offset,
        limit: input.limit,
        total: total.length,
      };
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Doctors not found",
    });
  },

  async create(input: CreateDoctorInput) {
    const transaction = await db.transaction(async (tx) => {
      const insert = await tx
        .insert(doctor)
        .values({
          fullName: input.fullName,
          doctorID: input.doctorID,
          note: input.note,
        })
        .returning({ id: doctor.id })
        .catch((error) => {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error instanceof Error ? error.message : String(error),
          });
        });

      if (insert.length !== 1 && !insert.at(0)?.id)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Health insurance could not created",
        });

      return await tx.query.doctor.findFirst({
        where: (doctor, { eq }) => eq(doctor.id, insert.at(0)!.id!),
      });
    });
    if (transaction) return transaction;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Doctor could not created",
    });
  },

  async update(input: UpdateDoctorInput) {
    const transaction = await db.transaction(async (tx) => {
      await tx
        .update(doctor)
        .set({
          fullName: input.fullName,
          doctorID: input.doctorID,
          note: input.note,
        })
        .where(eq(doctor.id, input.id))
        .catch((error) => {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error instanceof Error ? error.message : String(error),
          });
        });

      return await tx.query.doctor.findFirst({
        where: (doctor, { eq }) => eq(doctor.id, input.id),
      });
    });
    if (transaction) return transaction;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Doctor could not updated",
    });
  },

  async setStatus(input: SetStatusDoctorInput) {
    const transaction = await db.transaction(async (tx) => {
      await tx
        .update(doctor)
        .set({
          isActive: input.isActive,
        })
        .where(eq(doctor.id, input.id))
        .catch((error) => {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error instanceof Error ? error.message : String(error),
          });
        });

      return await tx.query.doctor.findFirst({
        where: (doctor, { eq }) => eq(doctor.id, input.id),
      });
    });
    if (transaction) return transaction;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Doctor could not updated",
    });
  },

  // TODO: test and improve return structure
  async getHealthCareProviders(id: number) {
    const res = await db.query.healthcareProviderDoctors.findMany({
      where: (healthcareProviderDoctors, { eq }) =>
        eq(healthcareProviderDoctors.doctorID, id),
      orderBy: [asc(healthcareProviderDoctors.id)],
      with: {
        healthcareProviders: true,
      },
    });
    if (res) return res;
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Healthcare providers not found",
    });
  },

  async addHealthCareProvider(input: AddDoctorInput) {
    const transaction = await db.transaction(async (tx) => {
      const checkIfAlreadyAdded =
        await tx.query.healthcareProviderDoctors.findFirst({
          where: (healthcareProviderDoctors, { eq }) =>
            eq(
              healthcareProviderDoctors.healthcareProviderID,
              input.healthcareProviderID,
            ) && eq(healthcareProviderDoctors.doctorID, input.doctorID),
        });
      if (checkIfAlreadyAdded)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Healthcare provider already added",
        });

      await tx
        .insert(healthcareProviderDoctors)
        .values({
          healthcareProviderID: input.healthcareProviderID,
          doctorID: input.doctorID,
        })
        .catch((error) => {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error instanceof Error ? error.message : String(error),
          });
        });

      return "Healthcare provider added" as const;
    });
    if (transaction) return transaction;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Healthcare provider could not created",
    });
  },

  async removeHealthCareProvider(input: RemoveDoctorInput) {
    const transaction = await db.transaction(async (tx) => {
      await tx
        .delete(healthcareProviderDoctors)
        .where(
          eq(healthcareProviderDoctors.doctorID, input.doctorID) &&
            eq(
              healthcareProviderDoctors.healthcareProviderID,
              input.healthcareProviderID,
            ),
        )
        .catch((error) => {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error instanceof Error ? error.message : String(error),
          });
        });

      return "Healthcare provider removed" as const;
    });
    if (transaction) return transaction;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Healthcare provider could not removed",
    });
  },
} as const;
