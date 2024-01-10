import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import { reportFiles } from "~/app/api/reports/route";
import ReportCard from "./ReportCard";

export default function Page({ params }: Readonly<{ params: { id: string } }>) {
  return (
    <>
      <PageHeader className="text-xl">Documents</PageHeader>

      <div className="flex flex-wrap gap-5">
        {reportFiles.map((report) => (
          <ReportCard
            key={crypto.randomUUID()}
            report={report}
            patientId={params.id}
          />
        ))}
      </div>
    </>
  );
}
