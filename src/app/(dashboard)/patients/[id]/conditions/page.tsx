import React from "react";
import PatientHeader from "../components/PatientHeader";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import Condition from "./Condition";
import PageHeader from "~/components/Headers/PageHeader";
import NewCondition from "./NewConditionDialog";

export type PatientConditionRes = Awaited<
  ReturnType<typeof api.patient.getByID.query>
>["conditions"][number];

export default async function Page({
  params,
}: Readonly<{ params: { id: string } }>) {
  const session = await getServerAuthSession();
  const isAdmin = session?.user.role === "admin";

  const { id } = params;
  const patient = await api.patient.getByID
    .query({ id })
    .catch(() => notFound());

  return (
    <div className="flex flex-col gap-4">
      <PatientHeader
        id={id}
        fullName={patient.fullName}
        isActive={patient.isActive}
        isAdmin={isAdmin}
      />

      <div className="w-full flex justify-between items-center">
        <PageHeader className="text-xl">Conditions</PageHeader>
        <NewCondition patientID={id} />
      </div>

      {patient.conditions.map((condition) => (
        <Condition
          condition={condition}
          session={session!}
          key={condition.id}
        />
      ))}
    </div>
  );
}
