import React from "react";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import Condition from "./Condition";
import PageHeader from "~/components/Headers/PageHeader";
import NewCondition from "./NewConditionDialog";
import { api } from "~/trpc/server";

export type PatientConditionRes = Awaited<
  ReturnType<typeof api.patient.getConditions.query>
>[number];

export default async function Page({
  params,
}: Readonly<{ params: { id: string } }>) {
  const session = await getServerAuthSession();

  const { id } = params;
  const conditions = await api.patient.getConditions
    .query({ id })
    .catch(() => notFound());

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <PageHeader className="text-xl">Conditions</PageHeader>
        <NewCondition patientID={id} />
      </div>

      {conditions.map((condition) => (
        <Condition
          condition={condition}
          session={session!}
          key={condition.id}
        />
      ))}
    </>
  );
}
