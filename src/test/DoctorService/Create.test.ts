import { test, describe } from "vitest";
import DoctorService from "~/server/service/DoctorService";
import type { TRPCContext } from "~/server/api/trpc";
import type { CreateDoctorInput } from "~/server/service/validation/DoctorValidation";

describe("create", () => {
  // Arrange
  const mockDb = {
    insert: () => ({
      values: () => ({
        returning: () => [
          {
            fullName: "Doctor 1",
            doctorID: "doctor1",
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

  const input: CreateDoctorInput = {
    fullName: "Doctor 1",
    doctorID: "doctor1",
  };

  test("test create not null", async ({ expect }) => {
    // Act
    const result = await DoctorService.create({ input, ctx });

    // Assert
    expect(result).not.toBeUndefined();
  });

  test("test create", async ({ expect }) => {
    // Act
    const result = await DoctorService.create({ input, ctx });

    // Assert
    expect(result).toEqual({
      fullName: "Doctor 1",
      doctorID: "doctor1",
    });
  });
});
