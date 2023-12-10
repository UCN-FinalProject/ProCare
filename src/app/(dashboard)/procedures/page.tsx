import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import Table from "./table";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getServerAuthSession } from "~/server/auth";

export default async function page() {
  const session = await getServerAuthSession();
  const procedures = await api.procedure.getMany.query({
    limit: 10,
    offset: 0,
  });

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between">
        <PageHeader>Procedures</PageHeader>
        {session?.user.role === "admin" && (
          <Button variant="secondary">
            <Link href="/procedures/create" className="flex items-center gap-1">
              <Plus className="w-[18px]" />
              Add new
            </Link>
          </Button>
        )}
      </div>
      <Table data={procedures.result} />
    </div>
  );
}
