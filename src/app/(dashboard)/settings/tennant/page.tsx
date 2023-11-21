import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import Form from "./form";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { notFound } from "next/navigation";

export type Tennant = Awaited<ReturnType<typeof api.tennant.getTennant.query>>;
export default async function page() {
  const session = await getServerAuthSession();

  if (!session?.user) return notFound();

  const tennant = await api.tennant.getTennant.query();
  return (
    <div className="flex flex-col gap-4">
      <PageHeader>Tennant settings</PageHeader>
      <div className="flex flex-col lg:max-w-lg">
        <Form tennant={tennant} />
      </div>
    </div>
  );
}
