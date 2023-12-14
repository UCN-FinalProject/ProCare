import { test, describe } from "vitest";
import ProcedureService from "~/server/service/ProcedureService";
import type { TRPCContext } from "~/server/api/trpc";
import type { GetManyProceduresInput } from "~/server/service/validation/ProcedureValidation";

describe("ProcedureService", () => {
  // Arrange
  const mockDb = {
    query: {
      procedures: {
        findMany: () => [
          { id: 1, name: "Procedure 1" },
          { id: 2, name: "Procedure 2" },
        ],
      },
    },
  };

  const ctx: TRPCContext = {
    // @ts-expect-error mock
    db: mockDb,
    // add other necessary context properties
  };

  describe("getMany function", () => {
    const input: GetManyProceduresInput = {
      limit: 2,
      offset: 0,
    };

    test("test length of the result", async ({ expect }) => {
      // Act
      const result = await ProcedureService.getMany({ ctx, input });
      // Assert
      expect(result.result.length).toEqual(2);
    });

    // test the result
    test("test the result", async ({ expect }) => {
      // Act
      const result = await ProcedureService.getMany({ ctx, input });
      // Assert
      expect(result.result).toEqual([
        { id: 1, name: "Procedure 1" },
        { id: 2, name: "Procedure 2" },
      ]);
    });

    test("the limit matches the input", async ({ expect }) => {
      // Act
      const result = await ProcedureService.getMany({ ctx, input });
      // Assert
      expect(result.limit).toEqual(2);
    });

    test("the offset matches the input", async ({ expect }) => {
      // Act
      const result = await ProcedureService.getMany({ ctx, input });
      // Assert
      expect(result.offset).toEqual(0);
    });

    test("the total matches result length", async ({ expect }) => {
      // Act
      const result = await ProcedureService.getMany({ ctx, input });
      // Assert
      expect(result.total).toEqual(result.result.length);
    });

    // test input when the name is not defined
    test("test input when the name is not defined", async ({ expect }) => {
      // Arrange
      const input: GetManyProceduresInput = {
        limit: 2,
        offset: 0,
      };
      // Act
      const result = await ProcedureService.getMany({ ctx, input });
      // Assert
      expect(result.result[0]?.name).toEqual("Procedure 1");
    });

    // test input when the name is defined
    test("test input when the name is defined", async ({ expect }) => {
      // Arrange
      const input: GetManyProceduresInput = {
        limit: 2,
        offset: 0,
        name: "Procedure 1",
      };
      // Act
      const result = await ProcedureService.getMany({ ctx, input });
      // Assert
      expect(result.result[0]?.name).toEqual("Procedure 1");
    });

    // test throw error
    test("test throw error", async ({ expect }) => {
      // Arrange
      const mockDb = {
        query: {
          procedures: {
            findMany: () => {
              throw new Error("Error");
            },
          },
        },
      };

      const ctx: TRPCContext = {
        // @ts-expect-error mock
        db: mockDb,
        // add other necessary context properties
      };

      const input: GetManyProceduresInput = {
        limit: 2,
        offset: 0,
      };

      // Act
      const result = ProcedureService.getMany({ ctx, input });

      // Assert
      await expect(result).rejects.toThrowError("Error");
    });

    // test result as undefined thorws error
    test("test result as undefined thorws error", async ({ expect }) => {
      // Arrange
      const mockDb = {
        query: {
          procedures: {
            findMany: () => {
              return undefined;
            },
          },
        },
      };

      const ctx: TRPCContext = {
        // @ts-expect-error mock
        db: mockDb,
        // add other necessary context properties
      };

      // Act
      const result = ProcedureService.getMany({ ctx, input });

      // Assert
      await expect(result).rejects.toThrowError("Procedures not found.");
    });
  });
});
