import { test, describe } from "vitest";
import DoctorService from "~/server/service/DoctorService";
import type { TRPCContext } from "~/server/api/trpc";
import type { GetManyDoctorsInput } from "~/server/service/validation/DoctorValidation";

describe("DoctorService", () => {
  // Arrange
  const mockDb = {
    query: {
      doctor: {
        findMany: () => [
          {
            id: 1,
            isActive: true,
            fullName: "Doctor 1",
            note: null,
            doctorID: "doctor1",
          },
          {
            id: 2,
            isActive: true,
            fullName: "Doctor 2",
            note: null,
            doctorID: "doctor2",
          },
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
    const input: GetManyDoctorsInput = {
      limit: 2,
      offset: 0,
    };

    test("test length of the result", async ({ expect }) => {
      // Act
      const result = await DoctorService.getMany({ ctx, input });
      // Assert
      expect(result.result.length).toEqual(2);
    });

    // test the result
    test("test the result", async ({ expect }) => {
      // Act
      const result = await DoctorService.getMany({ ctx, input });
      // Assert
      expect(result.result).toEqual([
        {
          id: 1,
          isActive: true,
          fullName: "Doctor 1",
          note: null,
          doctorID: "doctor1",
        },
        {
          id: 2,
          isActive: true,
          fullName: "Doctor 2",
          note: null,
          doctorID: "doctor2",
        },
      ]);
    });
  });
});
