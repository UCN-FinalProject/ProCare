import { test, describe } from "vitest";
import DoctorService from "~/server/service/DoctorService";
import type { TRPCContext } from "~/server/api/trpc";

describe("DoctorService", () => {
  // Arrange
  const mockDb = {
    query: {
      doctor: {
        findFirst: () => {
          return {
            id: 1,
            isActive: true,
            fullName: "Doctor 1",
            note: null,
            doctorID: "doctor1",
          };
        },
      },
    },
  };

  const ctx: TRPCContext = {
    // @ts-expect-error mock
    db: mockDb,
    // add other necessary context properties
  };

  describe("getMany function", () => {
    const id = 1;

    test("test id", async ({ expect }) => {
      // Act
      const result = await DoctorService.getByID({ ctx, id });
      // Assert
      expect(result.id).toEqual(id);
    });

    // test the result
    test("test the result", async ({ expect }) => {
      // Act
      const result = await DoctorService.getByID({ ctx, id });
      // Assert
      expect(result).toEqual({
        id: 1,
        isActive: true,
        fullName: "Doctor 1",
        note: null,
        doctorID: "doctor1",
      });
    });
  });
});
