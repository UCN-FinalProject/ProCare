import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Table from "./table";

export default async function page() {
  const session = await getServerAuthSession();
  const patients = await api.patient.getMany.query({
    limit: 10,
    offset: 0,
  });

  return (
 <div className="flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between">
        <PageHeader>Patients</PageHeader>
        {session?.user.role === "admin" && (
          <Button variant="secondary">
            <Link href="/patients/create" className="flex items-center gap-1">
              <Plus className="w-[18px]" />
              Add new
            </Link>
          </Button>
        )}
      </div>
      {/* {JSON.stringify(patients.result)} */}
      <Table data={patients.result} />
    </div>
  );
}
