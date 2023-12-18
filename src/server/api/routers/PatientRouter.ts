import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import PatientService from "~/server/service/PatientService";
import {
  createPatientInput,
  getPatientsInput,
  updatePatientInput,
  addPatientConditionInput,
  removePatientConditionInput,
  addPatientProcedureInput,
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
  setActive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return await PatientService.setStatus({
          input: {
            id: input.id,
            isActive: true,
          },
          ctx,
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: parseErrorMessage({
            error,
            defaultMessage: "Not found",
          }),
        });
      }
    }),

  setInactive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return await PatientService.setStatus({
          input: {
            id: input.id,
            isActive: false,
          },
          ctx,
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: parseErrorMessage({
            error,
            defaultMessage: "Not found",
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

  removeCondition: protectedProcedure
    .input(removePatientConditionInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await PatientService.removePatientCondition({ input, ctx });
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

  addProcedure: protectedProcedure
    .input(addPatientProcedureInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await PatientService.addPatientProcedure({ input, ctx });
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
