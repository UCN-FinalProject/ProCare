import { Plus } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import PageHeader from "~/components/Headers/PageHeader";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import Table from "./table";
import TableLoader from "./TableLoader";

export default async function page({
  searchParams,
}: Readonly<{
  searchParams?: {
    name?: string;
    doctorid?: string;
    status?: string;
    page?: string;
  };
}>) {
  const statusArr = ["active", "inactive", "all"] as const;
  type Status = (typeof statusArr)[number];

  const session = await getServerAuthSession();
  const name = searchParams?.name ?? undefined;
  const doctorid = searchParams?.doctorid ?? undefined;
  const page = Number(searchParams?.page) > 0 ? Number(searchParams?.page) : 1;
  const status =
    searchParams?.status && statusArr.includes(searchParams?.status as Status)
      ? searchParams?.status
      : undefined;

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between">
        <PageHeader>Doctors</PageHeader>
        {session?.user.role === "admin" && (
          <Button variant="secondary">
            <Link href="/doctors/create" className="flex items-center gap-1">
              <Plus className="w-[18px]" />
              Add new
            </Link>
          </Button>
        )}
      </div>
      <Suspense fallback={<TableLoader />}>
        <Table
          page={page}
          doctorid={doctorid}
          name={name}
          status={status}
          session={session!}
        />
      </Suspense>
    </div>
  );
}
