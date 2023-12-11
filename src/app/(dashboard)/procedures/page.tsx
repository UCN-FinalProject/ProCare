import React, { Suspense } from "react";
import PageHeader from "~/components/Headers/PageHeader";
import Table from "./table";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getServerAuthSession } from "~/server/auth";
import TableLoader from "./components/TableLoader";

export default async function Page({
  searchParams,
}: Readonly<{
  searchParams?: {
    name?: string;
    page?: string;
  };
}>) {
  const session = await getServerAuthSession();
  const name = searchParams?.name ?? undefined;
  const page = Number(searchParams?.page) > 0 ? Number(searchParams?.page) : 1;

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
      <Suspense fallback={<TableLoader />}>
        <Table name={name} page={page} />
      </Suspense>
    </div>
  );
}
