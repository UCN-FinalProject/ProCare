import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Table from "./table";

export default async function page() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const session = await getServerAuthSession();
  const doctors = await api.doctor.getMany.query({
    limit: 10,
    offset: 0,
  });

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between">
        <PageHeader>Doctors</PageHeader>
        {/* {session?.user.role === "admin" && ( */}
        <Button variant="secondary">
          <Link href="/doctors/create" className="flex items-center gap-1">
            <Plus className="w-[18px]" />
            Add new
          </Link>
        </Button>
        {/* )} */}
      </div>
      <Table data={doctors.result} />
    </div>
  );
}
