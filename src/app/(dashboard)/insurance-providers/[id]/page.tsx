import { notFound } from "next/navigation";
import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import { api } from "~/trpc/server";
import ID from "~/components/ID";
import Form from "./components/form";
import { Badge } from "~/components/ui/badge";
import HealthInsuranceAlert from "./components/HealthInsuranceAlert";
import { getServerAuthSession } from "~/server/auth";

export default async function page({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  const id = Number(params.id);
  const healthInsuranceProvider = await api.healthInsurance
    .getByID({ id })
    .catch(() => notFound());
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <ID className="text-3xl text-slate-400">{id}</ID>
          <PageHeader>{healthInsuranceProvider.name}</PageHeader>
          <Badge
            variant={
              healthInsuranceProvider.isActive === true ? "active" : "inactive"
            }
          >
            {healthInsuranceProvider.isActive === true ? "Active" : "Inactive"}
          </Badge>
        </div>
        {session?.user.role === "admin" && (
          <HealthInsuranceAlert
            variant={
              healthInsuranceProvider.isActive === true ? "active" : "inactive"
            }
            id={id}
          />
        )}
      </div>
      <div className="flex flex-col lg:max-w-lg">
        <Form data={healthInsuranceProvider} session={session} />
      </div>
    </div>
  );
}
