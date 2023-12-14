import { describe, test } from "vitest";
import ProcedureService from "~/server/service/ProcedureService";
import type { TRPCContext } from "~/server/api/trpc";
import type { UpdateProcedureInput } from "~/server/service/validation/ProcedureValidation";

describe("update function", () => {
  // Arrange
  const mockDb = {
    transaction: () => {
      const tx = {
        update: () => ({
          set: () => ({
            where: () => ({
              returning: () => [{ id: 1, name: "Updated Procedure" }],
            }),
          }),
        }),
        query: {
          procedures: {
            findFirst: () => ({ id: 1, name: "Updated Procedure" }),
          },
        },
      };
      return tx.update().set().where().returning()[0];
    },
  };

  const ctx: TRPCContext = {
    // @ts-expect-error mock
    db: mockDb,
    // add other necessary context properties
  };

  const input: UpdateProcedureInput = {
    id: 1,
    name: "Updated Procedure",
  };

  test("test transaction", async ({ expect }) => {
    // Act
    const result = await ProcedureService.update({ input, ctx });

    // Assert
    expect(result).toEqual({ id: 1, name: "Updated Procedure" });
  });

  test("test result being undefined throws an error", async ({ expect }) => {
    // Arrange
    const mockDb = {
      transaction: () => {
        const tx = {
          update: () => ({
            set: () => ({
              where: () => ({
                returning: () => undefined,
              }),
            }),
          }),
        };
        return tx.update().set().where().returning();
      },
    };

    const ctx: TRPCContext = {
      // @ts-expect-error mock
      db: mockDb,
      // add other necessary context properties
    };

    const input: UpdateProcedureInput = {
      id: 1,
      name: "Updated Procedure",
    };

    // Act
    const result = ProcedureService.update({ input, ctx });

    // Assert
    await expect(result).rejects.toThrowError(
      "Procedure could not be updated.",
    );
  });
});
