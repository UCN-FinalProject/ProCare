import React from "react";
import PatientHeader from "../components/PatientHeader";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import PageHeader from "~/components/Headers/PageHeader";
import NewProcedure from "./NewProcedureDialog";

export default async function Page({ params }: { params: { id: string } }) {
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

      <div className="w-full flex justify-between items-center">
        <PageHeader className="text-xl">Procedures</PageHeader>
        <NewProcedure patientID={id} />
      </div>

      {patient.procedures.map((procedure) => (
        <div key={procedure.id} className="flex flex-col gap-2">
          {JSON.stringify(procedure)}
        </div>
      ))}
    </div>
  );
}
