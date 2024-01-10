import { z } from "zod";
import { db } from "../db";
import { decryptText } from "../encrypt";

export default {
  async generateProcedureReport({ patientId }: { patientId: string }) {
    const id = z.string().parse(patientId);

    const patient = await db.query.patient.findFirst({
      where: (patient, { eq }) => eq(patient.id, id),
      columns: {
        fullName: true,
        ssn: true,
      },
    });
    if (!patient) throw new Error("Patient not found");

    const headDoctor = await db.query.headDoctor.findFirst({
      columns: { headDoctor: true },
    });
    if (!headDoctor) throw new Error("Head doctor not found");

    const patientProcedures = await db.query.patientProcedures.findMany({
      where: (patientProcedures, { eq }) => eq(patientProcedures.patientID, id),
      with: {
        procedures: true,
      },
    });
    if (!patientProcedures) throw new Error("Patient procedures not found");

    const procedures = patientProcedures.map((patientProcedure) => {
      return {
        id: patientProcedure.id,
        date: patientProcedure.createdAt.toLocaleDateString().split("T")[0],
        time: patientProcedure.createdAt.toTimeString().slice(0, 5),
        procedure_name: patientProcedure.procedures.name,
      };
    });

    return {
      full_name: patient.fullName,
      ssn: decryptText(patient.ssn),
      headDoctor_name: headDoctor?.headDoctor,
      procedures,
    };
  },

  async generateTreatmentEndReport({ patientId }: { patientId: string }) {
    const id = z.string().parse(patientId);

    const patient = await db.query.patient.findFirst({
      where: (patient, { eq }) => eq(patient.id, id),
      columns: {
        fullName: true,
        ssn: true,
      },
      with: { healthcareInfo: true, address: true },
    });
    if (!patient) throw new Error("Patient not found");

    const healthInsurance = await db.query.healthInsurance.findFirst({
      where: (healthInsurance, { eq }) =>
        eq(healthInsurance.id, patient.healthcareInfo.healthInsuranceID),
      columns: { name: true, insuranceID: true },
    });
    if (!healthInsurance) throw new Error("Health insurance not found");

    return {
      patient_name: patient.fullName,
      ssn: decryptText(patient.ssn),
      address1: patient.address.address1,
      city: patient.address.city,
      zip: patient.address.zipCode,
      healthInsurance_name: healthInsurance.name,
      healthInsurance_id: healthInsurance.insuranceID,
    };
  },
} as const;
