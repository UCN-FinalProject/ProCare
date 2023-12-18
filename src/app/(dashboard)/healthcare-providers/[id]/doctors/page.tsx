import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import NewDoctor from "../components/NewDoctor";
import DoctorsTable from "../components/DoctorsTable";
import { getServerAuthSession } from "~/server/auth";

export default async function Page({
  params,
}: Readonly<{ params: { id: string } }>) {
  const id = Number(params.id);
  const session = await getServerAuthSession();

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <PageHeader className="text-xl">Doctors</PageHeader>
        {session?.user.role === "admin" && (
          <NewDoctor healthCareProviderID={id} />
        )}
      </div>

      <DoctorsTable providerID={id} session={session!} />
    </>
  );
}
