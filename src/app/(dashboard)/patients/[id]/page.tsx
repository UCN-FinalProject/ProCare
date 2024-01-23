import React from "react";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import Form from "./components/Form";
import { GetPatient } from "./layout";

export type PatientRes = Awaited<ReturnType<typeof api.patient.getByID.query>>;

function getHealthcareProviders() {
  return api.healthcareProvider.getMany.query({
    limit: 100,
    offset: 0,
    isActive: true,
  });
}

function getDoctors() {
  return api.doctor.getMany.query({
    limit: 100,
    offset: 0,
    isActive: true,
  });
}

function getHealthInsurances() {
  return api.healthInsurance.getMany.query({
    limit: 100,
    offset: 0,
    isActive: true,
  });
}

export default async function page({
  params,
}: Readonly<{ params: { id: string } }>) {
  const id = String(params.id);
  const [healthcareProviders, doctors, healthInsurances, patient, session] =
    await Promise.all([
      getHealthcareProviders(),
      getDoctors(),
      getHealthInsurances(),
      GetPatient(id).catch(() => notFound()),
      getServerAuthSession(),
    ]);

  return (
    <div className="flex flex-col lg:max-w-lg">
      <Form
        patient={patient}
        doctors={doctors.result}
        healthcareProviders={healthcareProviders.result}
        healthInsurances={healthInsurances.result}
        session={session!}
      />
    </div>
  );
}
