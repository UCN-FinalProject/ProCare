import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import Form from "./form";
import { getServerAuthSession } from "~/server/auth";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";

async function getHealthInsurances() {
  return api.healthInsurance.getMany({
    limit: 100,
    offset: 0,
    isActive: true,
  });
}

async function getHealthcareProviders() {
  return api.healthcareProvider.getMany({
    limit: 100,
    offset: 0,
    isActive: true,
  });
}

export default async function Page({
  searchParams,
}: Readonly<{
  searchParams: {
    healthcareproviderid?: string;
  };
}>) {
  const [healthInsurances, healthcareProviders, doctors, session] =
    await Promise.all([
      getHealthInsurances(),
      getHealthcareProviders(),
      api.doctor.searchDoctors({
        healthCareProviderID: searchParams.healthcareproviderid
          ? Number(searchParams.healthcareproviderid)
          : undefined,
      }),
      getServerAuthSession(),
    ]);
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
