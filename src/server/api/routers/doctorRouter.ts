import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import DoctorService from "~/server/service/DoctorService";
import { TRPCError } from "@trpc/server";
import { parseErrorMessage } from "~/lib/parseError";
import {
  createDoctorInput,
  getManyDoctorsInput,
  updateDoctorInput,
  addDoctorInput,
  removeDoctorInput,
} from "~/server/service/validation/DoctorValidation";

export const doctorRouter = createTRPCRouter({
  getByID: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        return await DoctorService.getByID({ id: input.id, ctx });
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
    .input(getManyDoctorsInput)
    .query(async ({ input, ctx }) => {
      try {
        return await DoctorService.getMany({ input, ctx });
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
    .input(createDoctorInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await DoctorService.create({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: parseErrorMessage({
            error,
            defaultMessage: "Bad request",
          }),
        });
      }
    }),

  update: protectedProcedure
    .input(updateDoctorInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await DoctorService.update({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: parseErrorMessage({
            error,
            defaultMessage: "Bad request",
          }),
        });
      }
    }),

  setActive: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return await DoctorService.setStatus({
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
            defaultMessage: "Bad request",
          }),
        });
      }
    }),

  setInactive: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return await DoctorService.setStatus({
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
            defaultMessage: "Bad request",
          }),
        });
      }
    }),

  getHealthCareProviders: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        return await DoctorService.getHealthCareProviders({
          id: input.id,
          ctx,
        });
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

  addHealthCareProvider: protectedProcedure
    .input(addDoctorInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await DoctorService.addHealthCareProvider({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: parseErrorMessage({
            error,
            defaultMessage: "Bad request",
          }),
        });
      }
    }),

  removeHealthCareProvider: protectedProcedure
    .input(removeDoctorInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await DoctorService.removeHealthCareProvider({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: parseErrorMessage({
            error,
            defaultMessage: "Bad request",
          }),
        });
      }
    }),
});
