import React, { Suspense } from "react";
import PageHeader from "~/components/Headers/PageHeader";
import Table from "./table";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getServerAuthSession } from "~/server/auth";
import TableLoader from "./TableLoader";
import { roleArr, type Role } from "~/lib/parseUserRole";

export default async function Page({
  searchParams,
}: Readonly<{
  searchParams?: {
    name?: string;
    email?: string;
    role?: string;
    page?: string;
  };
}>) {
  const session = await getServerAuthSession();

  const name = searchParams?.name ?? undefined;
  const email = searchParams?.email ?? undefined;
  const page = Number(searchParams?.page) > 0 ? Number(searchParams?.page) : 1;
  const role =
    searchParams?.role && roleArr.includes(searchParams?.role as Role)
      ? searchParams?.role
      : undefined;

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between">
        <PageHeader>Users</PageHeader>
        {session?.user.role === "admin" && (
          <Button variant="secondary">
            <Link href="/users/create" className="flex items-center gap-1">
              <Plus className="w-[18px]" />
              Add new
            </Link>
          </Button>
        )}
      </div>
      <Suspense fallback={<TableLoader />}>
        <Table page={page} name={name} email={email} role={role as Role} />
      </Suspense>
    </div>
  );
}
