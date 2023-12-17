import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import PatientHeader from "../components/PatientHeader";
import { reportFiles } from "~/app/api/reports/route";
import ReportCard from "./ReportCard";

export default async function Page({
  params,
}: Readonly<{ params: { id: string } }>) {
  const { id } = params;
  const patient = await api.patient.getByID.query({ id });
  const session = await getServerAuthSession();
  const isAdmin = session?.user.role === "admin";

  return (
    <div className="flex flex-col gap-4">
      <PatientHeader
        id={id}
        fullName={patient.fullName}
        isActive={patient.isActive}
        isAdmin={isAdmin}
      />

      <PageHeader className="text-xl">Documents</PageHeader>

      <div className="flex flex-wrap gap-5">
        {reportFiles.map((report) => (
          <ReportCard key={crypto.randomUUID()} report={report} />
        ))}
      </div>
    </div>
  );
}
