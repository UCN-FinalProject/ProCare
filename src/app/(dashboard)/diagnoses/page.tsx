import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import Table from "./table";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

export default async function page() {
  const healthConditions = await api.healthCondition.getMany.query({
    limit: 10,
    offset: 0,
  });

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between">
        <PageHeader>Health conditions</PageHeader>
        {/* TODO: Hide button if user is not admin */}
        <Button>
          <Link href="/diagnoses/create" className="flex items-center gap-1">
            <Plus className="w-[18px]" />
            Add new
          </Link>
        </Button>
      </div>
      <Table data={healthConditions.result} />
    </div>
  );
}
