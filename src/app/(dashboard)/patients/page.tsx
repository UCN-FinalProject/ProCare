import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import Table from "./table";
import { statusArr, type Status } from "~/lib/parseStatus";

export default async function Page({
  searchParams,
}: Readonly<{
  searchParams?: {
    name?: string;
    doctorid?: string;
    status?: string;
    page?: string;
  };
}>) {
  const session = await getServerAuthSession();

  const name = searchParams?.name ?? undefined;
  const page = Number(searchParams?.page) > 0 ? Number(searchParams?.page) : 1;
  const status =
    searchParams?.status && statusArr.includes(searchParams?.status as Status)
      ? searchParams?.status
      : undefined;

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
      <Table page={page} name={name} status={status} session={session!} />
    </div>
  );
}
