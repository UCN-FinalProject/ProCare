import React from "react";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import Form from "./components/Form";
import { GetPatient } from "./layout";

export type PatientRes = Awaited<ReturnType<typeof api.patient.getByID>>;

function getHealthcareProviders() {
  return api.healthcareProvider.getMany({
    limit: 100,
    offset: 0,
    isActive: true,
  });
}

function getHealthInsurances() {
  return api.healthInsurance.getMany({
    limit: 100,
    offset: 0,
    isActive: true,
  });
}

export default async function page({
  params,
  searchParams,
}: Readonly<{
  params: { id: string };
  searchParams: { healthcareproviderid?: string };
}>) {
  const id = String(params.id);
  const [healthcareProviders, doctors, healthInsurances, patient, session] =
    await Promise.all([
      getHealthcareProviders(),
      api.doctor.searchDoctors({
        healthCareProviderID: searchParams.healthcareproviderid
          ? Number(searchParams.healthcareproviderid)
          : undefined,
      }),
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
