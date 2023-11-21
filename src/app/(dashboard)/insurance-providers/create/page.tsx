import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import Form from "./form";
import { getServerAuthSession } from "~/server/auth";
import { notFound } from "next/navigation";

export default async function Page() {
  const session = await getServerAuthSession();
  if (session?.user.role !== "admin") return notFound();

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <PageHeader>New insurance provider</PageHeader>
      <div className="flex flex-col lg:max-w-lg">
        <Form />
      </div>
    </div>
  );
}
