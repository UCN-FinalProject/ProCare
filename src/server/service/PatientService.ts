import { type TRPCContext } from "../api/trpc";
import {
  patient,
  patientAddress,
  patientConditions,
  patientHealthcareInfo,
} from "../db/export";
import { asc, eq, like } from "drizzle-orm";
import type {
  SetStatusPatientInput,
  CreatePatientInput,
  UpdatePatientInput,
  AddPatientConditionInput,
  GetPatientsInput,
  AddPatientProcedureInput,
  RemovePatientConditionInput,
} from "./validation/PatientValidation";
import { patientProcedures } from "../db/schema/patientProcedures";
import type { ReturnMany } from "./validation/util";
import { decryptText, encryptText } from "../encrypt";

export default {
  async getByPatientID({ id, ctx }: { id: string; ctx: TRPCContext }) {
    const res = await ctx.db.query.patient.findFirst({
      where: (patient, { eq }) => eq(patient.id, id),
      with: {
        address: true,
        healthcareInfo: true,
      },
    });

    if (!res) throw new Error("No patient was found.");

    return {
      ...res,
      ssn: decryptText(res.ssn),
    };
  },

  async getConditionsByPatientID({
    id,
    ctx,
  }: {
    id: string;
    ctx: TRPCContext;
  }) {
    const res = await ctx.db.query.patientConditions.findMany({
      where: (patientConditions, { eq }) =>
        eq(patientConditions.patientID, id) &&
        eq(patientConditions.removed, false),
      with: {
        condition: true,
      },
    });

    const conditions: PatientCondition[] = [];
    if (res) {
      for (const condition of res) {
        // skip removed/deleted conditions
        if (condition.removed) continue;

        const userRes = await ctx.db.query.users.findFirst({
          where: (user, { eq }) => eq(user.id, condition.assignedBy),
          columns: { id: true, name: true },
        });

        conditions.push({
          id: condition.id,
          conditionId: condition.conditionID,
          name: condition.condition.name,
          description: condition.condition.description,
          assignedAt: condition.assignedAt,
          assignedBy: userRes,
        } satisfies PatientCondition);
      }
    }
    if (conditions) return conditions;
    throw new Error("Patient conditions not found");
  },

  async getProceduresByPatientID({
    id,
    ctx,
  }: {
    id: string;
    ctx: TRPCContext;
  }) {
    const res = await ctx.db.query.patientProcedures.findMany({
      where: (patientProcedures, { eq }) => eq(patientProcedures.patientID, id),
      with: { procedures: true },
    });

    const procedures: PatientProcedure[] = [];
    if (res) {
      for (const procedure of res) {
        const userDetails = await ctx.db.query.users.findFirst({
          where: (user, { eq }) => eq(user.id, procedure.createdBy),
          columns: { id: true, name: true },
        });
        procedures.push({
          id: procedure.id,
          procedureID: procedure.procedureID,
          name: procedure.procedures.name,
          note: procedure.note,
          createdAt: procedure.createdAt,
          createdBy: userDetails,
        } satisfies PatientProcedure);
      }
    }
    if (procedures) return procedures.reverse();
    throw new Error("Patient procedures not found");
  },

  async getMany({ input, ctx }: { input: GetPatientsInput; ctx: TRPCContext }) {
    const res = await ctx.db.query.patient.findMany({
      limit: input.limit,
      offset: input.offset,
      with: {
        address: true,
        healthcareInfo: true,
      },
      where: findManyWhere(input),
      orderBy: [asc(patient.id)],
    });
    const total = await ctx.db.query.patient.findMany({
      columns: { id: true },
      where: findManyWhere(input),
    });
    res.forEach((patient) => {
      patient.ssn = decryptText(patient.ssn);
    });
    if (res)
      return {
        result: res,
        offset: input.offset,
        limit: input.limit,
        total: total.length,
      } satisfies ReturnMany<typeof res>;
    throw new Error("No patients were found.");
  },

  async createPatient({
    input,
    ctx,
  }: {
    input: CreatePatientInput;
    ctx: TRPCContext;
  }) {
    const transaction = await ctx.db.transaction(async (tx) => {
      const patientInsert = await tx
        .insert(patient)
        .values({
          fullName: input.fullName,
          isActive: input.isActive,
          biologicalSex: input.biologicalSex,
          dateOfBirth: input.dateOfBirth,
          ssn: encryptText(input.ssn),
          recommendationDate: input.recommendationDate ?? null,
          acceptanceDate: input.acceptanceDate ?? null,
          startDate: input.startDate,
          expectedEndOfTreatment: input.expectedEndOfTreatment,
          endDate: input.endDate ?? null,
          insuredID: input.insuredID,
          email: input.email ?? null,
          phone: input.phone ?? null,
          disability: input.disability,
          alergies: input.alergies ?? null,
          note: input.note ?? null,
        })
        .returning()
        .catch((err) => {
          tx.rollback();
          throw err;
        });

      if (!patientInsert[0]) throw new Error("Patient could not be created.");

      const newUserID = patientInsert[0].id;

      await tx
        .insert(patientAddress)
        .values({
          patientID: newUserID,
          address1: input.address1,
          address2: input.address2 ?? null,
          city: input.city,
          zipCode: input.zip,
        })
        .catch((err) => {
          tx.rollback();
          throw err;
        });

      await tx
        .insert(patientHealthcareInfo)
        .values({
          patientID: newUserID,
          healthInsuranceID: input.healthInsuranceID,
          doctorID: input.doctorID,
          healthcareProviderID: input.healthcareProviderID,
        })
        .catch((err) => {
          tx.rollback();
          throw err;
        });

      return await tx.query.patient.findFirst({
        where: (patient, { eq }) => eq(patient.id, patientInsert.at(0)!.id),
        with: {
          conditions: true,
          address: true,
          healthcareInfo: true,
        },
      });
    });

    if (transaction) return transaction;
    throw new Error("Patient could not be created.");
  },

  async updatePatient({
    input,
    ctx,
  }: {
    input: UpdatePatientInput;
    ctx: TRPCContext;
  }) {
    const transaction = await ctx.db.transaction(async (tx) => {
      await tx
        .update(patient)
        .set({
          fullName: input.fullName,
          recommendationDate: input.recommendationDate ?? null,
          acceptanceDate: input.acceptanceDate ?? null,
          expectedEndOfTreatment: input.expectedEndOfTreatment,
          insuredID: input.insuredID,
          email: input.email ?? null,
          phone: input.phone ?? null,
          disability: input.disability,
          alergies: input.alergies ?? null,
          note: input.note ?? null,
        })
        .where(eq(patient.id, input.id))
        .catch((err) => {
          tx.rollback();
          throw err;
        });

      await tx
        .update(patientAddress)
        .set({
          address1: input.address1,
          address2: input.address2 ?? null,
          city: input.city,
          zipCode: input.zip,
        })
        .where(eq(patientAddress.patientID, input.id))
        .catch((err) => {
          tx.rollback();
          throw err;
        });

      await tx
        .update(patientHealthcareInfo)
        .set({
          healthInsuranceID: input.healthInsuranceID,
          doctorID: input.doctorID,
          healthcareProviderID: input.healthcareProviderID,
        })
        .where(eq(patientHealthcareInfo.patientID, input.id))
        .catch((err) => {
          tx.rollback();
          throw err;
        });

      return await tx.query.patient.findFirst({
        where: (patient, { eq }) => eq(patient.id, input.id),
        with: {
          conditions: true,
          address: true,
          healthcareInfo: true,
        },
      });
    });

    if (transaction) return transaction;
    throw new Error("Patient could not be updated.");
  },

  async setStatus({
    input,
    ctx,
  }: {
    input: SetStatusPatientInput;
    ctx: TRPCContext;
  }) {
    const update = await ctx.db
      .update(patient)
      .set({
        isActive: input.isActive,
      })
      .where(eq(patient.id, input.id))
      .returning();

    if (update) return update;
    throw new Error("Patient could not be updated.");
  },

  async addPatientCondition({
    input,
    ctx,
  }: {
    input: AddPatientConditionInput;
    ctx: TRPCContext;
  }) {
    const conditions = await this.getConditionsByPatientID({
      id: input.patientID,
      ctx,
    });
    if (!patient) throw new Error("Patient was not found.");

    if (conditions.find((c) => c.conditionId === input.conditionID))
      throw new Error("Patient already has this condition.");

    const insert = await ctx.db
      .insert(patientConditions)
      .values({
        patientID: input.patientID,
        conditionID: input.conditionID,
        assignedBy: input.assignedByID,
        assignedAt: new Date(),
      })
      .returning();

    if (insert && !!insert[0]) return insert[0];
    throw new Error("Condition could not be added.");
  },

  async removePatientCondition({
    input,
    ctx,
  }: {
    input: RemovePatientConditionInput;
    ctx: TRPCContext;
  }) {
    const findCondition = await ctx.db.query.patientConditions.findFirst({
      where: (patientConditions, { eq }) =>
        eq(patientConditions.id, input.patientConditionID),
      columns: { conditionID: true },
    });
    if (!findCondition)
      throw new Error("Condition is not assigned to a patient.");

    const update = await ctx.db
      .update(patientConditions)
      .set({
        removed: true,
        removedAt: new Date(),
        removedBy: input.userID,
      })
      .where(eq(patientConditions.id, input.patientConditionID))
      .returning();

    if (update) return update;
    throw new Error("Condition could not be removed.");
  },

  async addPatientProcedure({
    input,
    ctx,
  }: {
    input: AddPatientProcedureInput;
    ctx: TRPCContext;
  }) {
    const insert = await ctx.db
      .insert(patientProcedures)
      .values({
        patientID: input.patientID,
        procedureID: input.procedureID,
        note: input.note ?? null,
        createdBy: input.userID,
        createdAt: new Date(),
      })
      .returning();

    if (insert && !!insert[0]) return insert[0];
    throw new Error("Procedure could not be added.");
  },
} as const;

const findManyWhere = (input: GetPatientsInput) => {
  let where = undefined;
  if (input.isActive !== undefined)
    where = eq(patient.isActive, input.isActive);
  if (input.name !== undefined)
    where = like(patient.fullName, `%${input.name}%`);
  return where;
};

type PatientCondition = {
  id: number;
  conditionId: number;
  name: string;
  description: string;
  assignedAt: Date;
  assignedBy:
    | {
        id: string;
        name: string;
      }
    | undefined;
};

type PatientProcedure = {
  id: number;
  procedureID: number;
  name: string | undefined;
  note: string | null;
  createdAt: Date;
  createdBy:
    | {
        id: string;
        name: string;
      }
    | undefined;
};
