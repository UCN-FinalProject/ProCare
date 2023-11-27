import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import PatientService from "~/server/service/PatientService";
import {
  createPatientInput,
  getPatientsInput,
  updatePatientInput,
  addPatientConditionInput,
} from "~/server/service/validation/PatientValidation";
import { parseErrorMessage } from "~/lib/parseError";

export const patientRouter = createTRPCRouter({
  getByID: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        return await PatientService.getByPatientID({ id: input.id, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: parseErrorMessage({
            error,
            defaultMessage: "Not found",
          }),
        });
      }
    }),

  getMany: protectedProcedure
    .input(getPatientsInput)
    .query(async ({ input, ctx }) => {
      try {
        return await PatientService.getMany({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: parseErrorMessage({
            error,
            defaultMessage: "Not found",
          }),
        });
      }
    }),

  create: protectedProcedure
    .input(createPatientInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await PatientService.createPatient({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: parseErrorMessage({
            error,
            defaultMessage: "Bad Request",
          }),
        });
      }
    }),

  update: protectedProcedure
    .input(updatePatientInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await PatientService.updatePatient({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: parseErrorMessage({
            error,
            defaultMessage: "Bad Request",
          }),
        });
      }
    }),

  addCondition: protectedProcedure
    .input(addPatientConditionInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await PatientService.addPatientCondition({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: parseErrorMessage({
            error,
            defaultMessage: "Bad Request",
          }),
        });
      }
    }),
});
