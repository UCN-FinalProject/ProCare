import { describe, test } from "vitest";
import ProcedureService from "~/server/service/ProcedureService";
import type { TRPCContext } from "~/server/api/trpc";
import type { CreateProcedurePricingInput } from "~/server/service/validation/ProcedureValidation";

describe("addPricing function", () => {
  // Arrange
  const mockDb = {
    insert: () => ({
      values: () => ({
        returning: () => [
          {
            healthInsuranceId: 1,
            procedureId: 1,
            credits: 10,
            price: "100",
          },
        ],
      }),
    }),
  };

  const ctx: TRPCContext = {
    // @ts-expect-error mock
    db: mockDb,
    // add other necessary context properties
  };

  const input: CreateProcedurePricingInput = {
    healthInsuranceId: 1,
    procedureId: 1,
    credits: 10,
    price: "100",
  };

  test("test transaction", async ({ expect }) => {
    // Act
    const result = await ProcedureService.addPricing({ input, ctx });

    // Assert
    expect(result).toEqual([
      {
        healthInsuranceId: 1,
        procedureId: 1,
        credits: 10,
        price: "100",
      },
    ]);
  });

  test("test result being undefined throws an error", async ({ expect }) => {
    // Arrange
    const mockDb = {
      insert: () => ({
        values: () => ({
          returning: () => undefined,
        }),
      }),
    };
    const ctx: TRPCContext = {
      // @ts-expect-error mock
      db: mockDb,
      // add other necessary context properties
    };

    // Act
    const result = ProcedureService.addPricing({ input, ctx });

    // Assert
    await expect(result).rejects.toThrowError(
      "Procedure pricing could not be created.",
    );
  });
});
