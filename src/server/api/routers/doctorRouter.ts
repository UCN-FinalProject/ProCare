import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
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
  getByID: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        return await DoctorService.getByID(input.id);
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

  getMany: publicProcedure
    .input(getManyDoctorsInput)
    .query(async ({ input }) => {
      try {
        return await DoctorService.getMany(input);
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

  create: publicProcedure
    .input(createDoctorInput)
    .mutation(async ({ input }) => {
      try {
        return await DoctorService.create(input);
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

  update: publicProcedure
    .input(updateDoctorInput)
    .mutation(async ({ input }) => {
      try {
        return await DoctorService.update(input);
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

  setActive: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        return await DoctorService.setStatus({
          id: input.id,
          isActive: true,
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

  setInactive: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        return await DoctorService.setStatus({
          id: input.id,
          isActive: false,
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

  getHealthCareProviders: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        return await DoctorService.getHealthCareProviders(input.id);
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

  addHealthCareProvider: publicProcedure
    .input(addDoctorInput)
    .mutation(async ({ input }) => {
      try {
        return await DoctorService.addHealthCareProvider(input);
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

  removeHealthCareProvider: publicProcedure
    .input(removeDoctorInput)
    .mutation(async ({ input }) => {
      try {
        return await DoctorService.removeHealthCareProvider(input);
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
