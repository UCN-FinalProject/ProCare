import { test, describe } from "vitest";
import ProcedureService from "~/server/service/ProcedureService";
import type { TRPCContext } from "~/server/api/trpc";
import type { GetManyProceduresInput } from "~/server/service/validation/ProcedureValidation";

describe("ProcedureService", () => {
  describe("getMany function", () => {
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
      db: mockDb,
      // add other necessary context properties
    };

    const input: GetManyProceduresInput = {
      limit: 2,
      offset: 0,
      // name: "Procedure",
    };

    test("test length of the result", async ({ expect }) => {
      // Act
      const result = await ProcedureService.getMany({ ctx, input });

      // Assert
      expect(result.result.length).toEqual(2);
      // is(result.limit, 2);
      // is(result.offset, 0);
      // is(result.total, 2);
    });

    test("first object of the array", async ({ expect }) => {
      // Act
      const result = await ProcedureService.getMany({ ctx, input });

      // Assert
      expect(result.result[0]?.name).toEqual("Procedure 1");
    });

    test("second object of the array", async ({ expect }) => {
      // Act
      const result = await ProcedureService.getMany({ ctx, input });

      // Assert
      expect(result.result[1]?.name).toEqual("Procedure 2");
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
  });
});
