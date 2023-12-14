import { test, describe } from "vitest";
import ProcedureService from "~/server/service/ProcedureService";
import type { TRPCContext } from "~/server/api/trpc";
import type {
  CreateProcedureInput,
  CreateProcedurePricingWithoutProcedureID,
} from "~/server/service/validation/ProcedureValidation";

describe("create", () => {
  // Arrange
  const mockDb = {
    transaction: () => {
      const tx = {
        insert: () => ({
          values: () => ({
            returning: () => [{ id: 1, name: "Procedure 1" }],
          }),
        }),
      };
      return tx.insert().values().returning()[0];
    },
  };

  const ctx: TRPCContext = {
    // @ts-expect-error mock
    db: mockDb,
    // add other necessary context properties
  };

  const input: CreateProcedureInput = {
    name: "Procedure 1",
  };

  const pricingInput: CreateProcedurePricingWithoutProcedureID[] = [
    { healthInsuranceId: 1, credits: 10, price: "100" },
    { healthInsuranceId: 2, credits: 20, price: "200" },
  ] satisfies CreateProcedurePricingWithoutProcedureID[];

  test("test transaction", async ({ expect }) => {
    // Act
    const result = await ProcedureService.create({ input, pricingInput, ctx });

    // Assert
    expect(result).toEqual({ id: 1, name: "Procedure 1" });
  });

  test("test result being undefined throws an error", async ({ expect }) => {
    // Arrange
    const mockDb = {
      transaction: () => {
        const tx = {
          insert: () => ({
            values: () => ({
              returning: () => undefined,
            }),
          }),
        };
        return tx.insert().values().returning();
      },
    };

    const ctx: TRPCContext = {
      // @ts-expect-error mock
      db: mockDb,
      // add other necessary context properties
    };

    // Act
    const result = ProcedureService.create({ input, pricingInput, ctx });

    // Assert
    await expect(result).rejects.toThrowError(
      "Procedure could not be created.",
    );
  });
});
