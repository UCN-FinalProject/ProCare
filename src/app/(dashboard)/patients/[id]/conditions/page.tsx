import React from "react";
import PatientHeader from "../components/PatientHeader";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

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
    <div>
      <PatientHeader
        id={id}
        fullName={patient.fullName}
        isActive={patient.isActive}
        isAdmin={isAdmin}
      />
      conditons
      {JSON.stringify(patient.conditions)}
    </div>
  );
}
