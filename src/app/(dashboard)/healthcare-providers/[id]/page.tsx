import { notFound } from "next/navigation";
import React from "react";
// import { api } from "~/trpc/server";
import Form from "./components/form";
import { getServerAuthSession } from "~/server/auth";
import { GetHealthCareProvider } from "./layout";

export default async function page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const session = await getServerAuthSession();
  console.log("await from page");
  const healthcareProvider = await GetHealthCareProvider(id).catch(() =>
    notFound(),
  );

  return (
    <div className="flex flex-col lg:max-w-lg">
      <Form healthcareProvider={healthcareProvider} session={session!} />
    </div>
  );
}
