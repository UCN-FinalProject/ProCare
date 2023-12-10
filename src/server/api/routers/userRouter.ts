import { z } from "zod";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import UserService from "~/server/service/UserService";
import {
  createUserInput,
  updateUserInput,
} from "~/server/service/validation/UserValidation";
import EmailService from "~/server/service/EmailService";
import { parseErrorMessage } from "~/lib/parseError";

export const userRouter = createTRPCRouter({
  getByID: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        return await UserService.getByID({ id: input.id, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: parseErrorMessage({
            error,
            defaultMessage: "User not found",
          }),
        });
      }
    }),

  getCredentialsByUserID: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        return await UserService.getCredentialsByUserID({ id: input.id, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: parseErrorMessage({
            error,
            defaultMessage: "Credentials not found",
          }),
        });
      }
    }),

  getMany: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await UserService.getMany(ctx);
    } catch (error) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: parseErrorMessage({
          error,
          defaultMessage: "Users not found",
        }),
      });
    }
  }),

  create: adminProcedure
    .input(createUserInput)
    .mutation(async ({ input, ctx }) => {
      try {
        const res = await UserService.create({ input, ctx });

        try {
          await EmailService.sendEmail({
            to: input.email,
            subject: "Welcome to ProCare!",
          });
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send email",
          });
        }

        return res;
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
    .input(updateUserInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await UserService.update({ input, ctx });
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
