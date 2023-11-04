import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import Table from "./table";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function page() {
  const insuranceProviders =
    await api.healthInsurance.getHealthInsurances.query({
      limit: 10,
      offset: 0,
    });

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between">
        <PageHeader>Insurance providers</PageHeader>
        {/* TODO: Hide button if user is not admin */}
        <Button>
          <Link
            href="/insurance-providers/create"
            className="flex items-center gap-1"
          >
            <Plus className="w-[18px]" />
            Add new
          </Link>
        </Button>
      </div>
      <Table data={insuranceProviders.result} />
    </div>
  );
}
