import React from "react";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import PageHeader from "~/components/Headers/PageHeader";
import { getServerAuthSession } from "~/server/auth";
import { Badge } from "~/components/ui/badge";
import PatientAlert from "./components/PatientAlert";
import Form from "./components/Form";

export default async function page({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  const id = String(params.id);
  const patient = await api.patient.getByID
    .query({ id })
    .catch(() => notFound());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <PageHeader>{patient.fullName}</PageHeader>
          <Badge variant={patient.isActive === true ? "active" : "inactive"}>
            {patient.isActive === true ? "Alive" : "BannedIRL"}
          </Badge>
        </div>
        {session?.user.role === "admin" && (
          <PatientAlert
            variant={patient.isActive === true ? "Chillen" : "DDDDDDD....DEAD"}
            id={id}
          />
        )}
      </div>
      <div className="flex flex-col lg:max-w-lg">
        <Form patient={patient} session={session!} />
      </div>
    </div>
  );
}
