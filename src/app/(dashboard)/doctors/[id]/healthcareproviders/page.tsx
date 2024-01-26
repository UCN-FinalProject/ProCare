import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import DoctorHealthCareProvidersTable from "./table";
import { getServerAuthSession } from "~/server/auth";

export default async function Page({
  params,
  searchParams,
}: Readonly<{
  params: { id: string };
  searchParams: {
    page?: string;
  };
}>) {
  const { id } = params;
  const doctorId = Number(id);
  const page = Number(searchParams?.page) > 0 ? Number(searchParams?.page) : 1;
  const session = await getServerAuthSession();

  return (
    <>
      <PageHeader className="text-md font-medium text-gray-700">
        Health Care Providers this doctor is assigned to
      </PageHeader>
      <DoctorHealthCareProvidersTable
        doctorId={doctorId}
        page={page}
        session={session!}
      />
    </>
  );
}
