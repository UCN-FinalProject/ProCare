import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import Form from "./form";
import { api } from "~/trpc/server";

export type Tennant = Awaited<ReturnType<typeof api.tennant.getTennant.query>>;
export default async function page() {
  // TODO: if user is not admin, return notFound
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
