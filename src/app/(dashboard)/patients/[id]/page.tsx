import React from "react";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import PageHeader from "~/components/Headers/PageHeader";
import { getServerAuthSession } from "~/server/auth";
import { Badge } from "~/components/ui/badge";
import PatientAlert from "./components/PatientAlert";
import Form from "./components/Form";

export default async function page({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  const isAdmin = session?.user.role === "admin";
  const id = String(params.id);
  const patient = await api.patient.getByID
    .query({ id })
    .catch(() => notFound());
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
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <PageHeader>{patient.fullName}</PageHeader>
          <Badge variant={patient.isActive === true ? "active" : "inactive"}>
            {patient.isActive === true ? "active" : "inactive"}
          </Badge>
        </div>
        {isAdmin && (
          <PatientAlert
            variant={patient.isActive === true ? "active" : "inactive"}
            id={id}
          />
        )}
      </div>
      <div className="flex flex-col lg:max-w-lg">
        <Form
          patient={patient}
          doctors={doctors.result}
          healthcareProviders={healthcareProviders.result}
          healthInsurances={healthInsurances.result}
          session={session!}
        />
      </div>
    </div>
  );
}
