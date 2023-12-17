import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import Form from "./form";
import { getServerAuthSession } from "~/server/auth";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";

export default async function Page() {
  const healthInsurances = await api.healthInsurance.getMany.query({
    limit: 100,
    offset: 0,
    isActive: true,
  });
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
  const session = await getServerAuthSession();
  if (session?.user.role !== "admin") return notFound();

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <PageHeader>New Patient</PageHeader>
      <div className="flex flex-col lg:max-w-lg">
        <Form
          healthInsurances={healthInsurances.result}
          healthcareProviders={healthcareProviders.result}
          doctors={doctors.result}
        />
      </div>
    </div>
  );
}
