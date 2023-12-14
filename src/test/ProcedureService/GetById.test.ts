import { test, describe } from "vitest";
import ProcedureService from "~/server/service/ProcedureService";
import type { TRPCContext } from "~/server/api/trpc";
import { db } from "~/server/db";
import type { HealthInsurance } from "~/server/db/export";

describe("ProcedureService", async () => {
  const findFirst = await db.query.procedures.findFirst({
    with: {
      procedurePricing: true,
    },
  });

  type FindFirstProcedure = typeof findFirst;

  // Arrange
  const mockDb = {
    query: {
      procedures: {
        findFirst: () =>
          ({
            id: 1,
            name: "Procedure 1",
            procedurePricing: [
              {
                id: 1,
                procedureId: 1,
                healthInsuranceId: 1,
                credits: 1,
                price: "100",
                created: new Date("2023-01-01"),
              },
              {
                id: 2,
                procedureId: 1,
                healthInsuranceId: 1,
                credits: 1,
                price: "200",
                created: new Date("2022-01-02"),
              },
            ],
          }) satisfies FindFirstProcedure,
      },
      healthInsurance: {
        findMany: () =>
          [
            {
              id: 1,
              name: "Insurance 1",
              insuranceID: 1,
              registeredID: 1,
              pricePerCredit: "100",
              isActive: true,
            },
          ] satisfies Omit<
            HealthInsurance,
            "healthInsuranceAddress" | "healthInsuranceVAT"
          >[],
      },
    },
  };

  const ctx: TRPCContext = {
    // @ts-expect-error mock
    db: mockDb,
    // add other necessary context properties
  };

  const id = 1;

  test("test id", async ({ expect }) => {
    // Act
    const result = await ProcedureService.getByID({ id, ctx });
    // Assert
    expect(result.id).toEqual(id);
  });

  test("test name", async ({ expect }) => {
    // Act
    const result = await ProcedureService.getByID({ id, ctx });
    // Assert
    expect(result.name).toEqual("Procedure 1");
  });

  test("test procedurePricing length", async ({ expect }) => {
    // Act
    const result = await ProcedureService.getByID({ id, ctx });
    // Assert
    expect(result.procedurePricing.length).toEqual(1);
  });

  test("test procedurePricing healthInsuranceId", async ({ expect }) => {
    // Act
    const result = await ProcedureService.getByID({ id, ctx });
    // Assert
    expect(result.procedurePricing[0]?.healthInsuranceId).toEqual(1);
  });

  test("test procedurePricing price", async ({ expect }) => {
    // Act
    const result = await ProcedureService.getByID({ id, ctx });
    // Assert
    expect(result.procedurePricing[0]?.price).toEqual("100");
  });

  test("test procedurePricing credits", async ({ expect }) => {
    // Act
    const result = await ProcedureService.getByID({ id, ctx });
    // Assert
    expect(result.procedurePricing[0]?.credits).toEqual(1);
  });
});
