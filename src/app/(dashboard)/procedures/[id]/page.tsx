import { notFound } from "next/navigation";
import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import { api } from "~/trpc/server";
import ID from "~/components/ID";
import Form from "./form";
import { getServerAuthSession } from "~/server/auth";
import ProcedurePricing from "../components/ProcedurePricing";

export default async function page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const session = await getServerAuthSession();
  const procedure = await api.procedure.getByID({ id }).catch(() => notFound());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <ID className="text-3xl text-slate-400">{id}</ID>
          <PageHeader>{procedure.name}</PageHeader>
        </div>
      </div>
      <div className="flex flex-col lg:max-w-lg gap-y-6">
        <Form procedure={procedure} session={session!} />

        {/* display pricing only for admin users */}
        {session?.user?.role === "admin" && (
          <ProcedurePricing
            variant="update"
            procedurePricing={procedure.procedurePricing}
          />
        )}
      </div>
    </div>
  );
}
