import React from "react";
// import PatientHeader from "./components/PatientHeader";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import DoctorHeader from "./components/DoctorHeader";
import { getServerAuthSession } from "~/server/auth";

async function getDoctor(id: number) {
  return await api.doctor.getByID({ id });
}

export const GetDoctor = React.cache(getDoctor);

export default async function Layout({
  params,
  children,
}: Readonly<{ params: { id: string }; children: React.ReactNode }>) {
  const id = Number(params.id);
  const [session, doctor] = await Promise.all([
    getServerAuthSession(),
    GetDoctor(id).catch(() => notFound()),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <DoctorHeader
        id={doctor.id}
        fullName={doctor.fullName}
        isActive={doctor.isActive}
        isAdmin={session!.user.role === "admin"}
      />
      {children}
    </div>
  );
}
