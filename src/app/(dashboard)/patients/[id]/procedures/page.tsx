import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import NewProcedure from "./NewProcedureDialog";
import Procedure from "./Procedure";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";

export type PatientConditionRes = Awaited<
  ReturnType<typeof api.patient.getProcedures.query>
>[number];

export default async function Page({
  params,
}: Readonly<{ params: { id: string } }>) {
  const { id } = params;
  const procedures = await api.patient.getProcedures
    .query({ id })
    .catch(() => notFound());

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <PageHeader className="text-xl">Procedures</PageHeader>
        <NewProcedure patientID={id} />
      </div>

      <div className="flex flex-col">
        {procedures.map((procedure) => (
          <Procedure key={procedure.id} procedure={procedure} />
        ))}
      </div>
    </>
  );
}
