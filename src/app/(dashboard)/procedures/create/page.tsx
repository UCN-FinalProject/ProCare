import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import Form from "./form";
import { getServerAuthSession } from "~/server/auth";
import { notFound } from "next/navigation";
import ProcedurePricing from "../components/ProcedurePricing";
import { api } from "~/trpc/server";

export default async function Page() {
  const session = await getServerAuthSession();
  if (session?.user.role !== "admin") return notFound();

  const healthInsurances = await api.healthInsurance.getMany.query({
    limit: 100,
    offset: 0,
    isActive: true,
  });

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <PageHeader>New procedure</PageHeader>
      <div className="flex flex-col lg:max-w-lg gap-y-6">
        <Form />
        <ProcedurePricing variant="create" data={healthInsurances.result} />
      </div>
    </div>
  );
}
