import React from "react";
import { api } from "~/trpc/server";
import PageHeader from "~/components/Headers/PageHeader";
import NewProcedure from "./NewProcedureDialog";
import Procedure from "./Procedure";

export type PatientConditionRes = Awaited<
  ReturnType<typeof api.patient.getByID.query>
>["procedures"][number];

export default async function Page({
  params,
}: Readonly<{ params: { id: string } }>) {
  const { id } = params;
  const patient = await api.patient.getByID.query({ id });

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <PageHeader className="text-xl">Procedures</PageHeader>
        <NewProcedure patientID={id} />
      </div>

      <div className="flex flex-col">
        {patient.procedures.map((procedure) => (
          <Procedure key={procedure.id} procedure={procedure} />
        ))}
      </div>
    </>
  );
}
