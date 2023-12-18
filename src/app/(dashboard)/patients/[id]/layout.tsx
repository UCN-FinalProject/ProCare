import React from "react";
import PatientHeader from "./components/PatientHeader";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";

export default async function Layout({
  params,
  children,
}: Readonly<{ params: { id: string }; children: React.ReactNode }>) {
  const session = await getServerAuthSession();
  const isAdmin = session?.user.role === "admin";
  const id = String(params.id);
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
      {children}
    </div>
  );
}
