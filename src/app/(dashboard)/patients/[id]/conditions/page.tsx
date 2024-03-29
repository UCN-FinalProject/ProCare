import React from "react";
import { getServerAuthSession } from "~/server/auth";
import Condition from "./Condition";
import PageHeader from "~/components/Headers/PageHeader";
import NewCondition from "./NewConditionDialog";
import { api } from "~/trpc/server";

export type PatientConditionRes = Awaited<
  ReturnType<typeof api.patient.getConditions>
>[number];

async function getSession() {
  return getServerAuthSession();
}

async function getConditions(id: string) {
  return api.patient.getConditions({ id });
}

export default async function Page({
  params,
}: Readonly<{ params: { id: string } }>) {
  const { id } = params;

  const [session, conditions] = await Promise.all([
    getSession(),
    getConditions(id),
  ]);

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
