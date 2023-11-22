import { notFound } from "next/navigation";
import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import { api } from "~/trpc/server";
import ID from "~/components/ID";
import Form from "./components/form";
import { Badge } from "~/components/ui/badge";
import { getServerAuthSession } from "~/server/auth";
import HealthcareProviderAlert from "./components/HealthcareProviderAlert";

export default async function page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const session = await getServerAuthSession();
  const healthcareProvider = await api.healthcareProvider.getByID
    .query({ id })
    .catch(() => notFound());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <ID className="text-3xl text-slate-400">{id}</ID>
          <PageHeader>{healthcareProvider.name}</PageHeader>
          <Badge
            variant={
              healthcareProvider.isActive === true ? "active" : "inactive"
            }
          >
            {healthcareProvider.isActive === true ? "Active" : "Inactive"}
          </Badge>
        </div>
        {session?.user.role === "admin" && (
          <HealthcareProviderAlert
            variant={
              healthcareProvider.isActive === true ? "active" : "inactive"
            }
            id={id}
          />
        )}
      </div>
      <div className="flex flex-col lg:max-w-lg">
        <Form healthcareProvider={healthcareProvider} session={session!} />
      </div>
    </div>
  );
}
