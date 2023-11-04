import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import Table from "./table";
import { api } from "~/trpc/server";

export default async function page() {
  const insuranceProviders =
    await api.healthInsurance.getHealthInsurances.query({
      limit: 10,
      offset: 0,
    });

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <PageHeader>Insurance providers</PageHeader>
      <Table data={insuranceProviders.result} />
    </div>
  );
}
