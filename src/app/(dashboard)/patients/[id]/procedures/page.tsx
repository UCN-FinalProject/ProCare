import React from "react";
import PatientHeader from "../components/PatientHeader";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import PageHeader from "~/components/Headers/PageHeader";
import NewProcedure from "./NewProcedureDialog";
import Procedure from "./Procedure";

export type PatientConditionRes = Awaited<
  ReturnType<typeof api.patient.getByID.query>
>["procedures"][number];

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

      <div className="flex flex-col">
        {patient.procedures.map((procedure) => (
          <Procedure key={procedure.id} procedure={procedure} />
        ))}
      </div>
    </div>
  );
}
