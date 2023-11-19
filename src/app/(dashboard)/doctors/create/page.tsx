import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import Form from "./form";
import { getServerAuthSession } from "~/server/auth";
import { notFound } from "next/navigation";

export default async function Page() {
  const session = await getServerAuthSession();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (session?.user.role !== "admin") return notFound();

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <PageHeader>New doctor</PageHeader>
      <div className="flex flex-col lg:max-w-lg">
        <Form />
      </div>
    </div>
  );
}
