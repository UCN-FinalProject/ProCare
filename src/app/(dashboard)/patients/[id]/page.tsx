import React from "react";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import Form from "./components/Form";
import { GetPatient } from "./layout";

export type PatientRes = Awaited<ReturnType<typeof api.patient.getByID.query>>;

export default async function page({
  params,
}: Readonly<{ params: { id: string } }>) {
  const session = await getServerAuthSession();
  const id = String(params.id);
  const patient = await GetPatient(id).catch(() => notFound());
  const healthcareProviders = await api.healthcareProvider.getMany.query({
    limit: 100,
    offset: 0,
    isActive: true,
  });
  const doctors = await api.doctor.getMany.query({
    limit: 100,
    offset: 0,
    isActive: true,
  });
  const healthInsurances = await api.healthInsurance.getMany.query({
    limit: 100,
    offset: 0,
    isActive: true,
  });

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
