import React from "react";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import HealthCareProviderHeader from "./components/HealthcareProviderHeader";

async function getHealthCareProvider(id: number) {
  return await api.healthcareProvider.getByID({ id });
}

export const GetHealthCareProvider = React.cache(getHealthCareProvider);

export default async function Layout({
  params,
  children,
}: Readonly<{ params: { id: string }; children: React.ReactNode }>) {
  const id = Number(params.id);
  const session = await getServerAuthSession();
  const healthcareProvider = await GetHealthCareProvider(id).catch(() =>
    notFound(),
  );

  return (
    <div className="flex flex-col gap-4">
      <HealthCareProviderHeader
        id={id}
        name={healthcareProvider.name}
        isActive={healthcareProvider.isActive}
        isAdmin={session!.user.role === "admin"}
      />
      {children}
    </div>
  );
}
