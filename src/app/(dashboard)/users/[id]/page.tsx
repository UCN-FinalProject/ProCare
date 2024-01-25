import { notFound } from "next/navigation";
import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import { api } from "~/trpc/server";
import Form from "./form";
import { getServerAuthSession } from "~/server/auth";

export default async function page({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  const user = await api.user
    .getByID({ id: params.id })
    .catch(() => notFound());
  return (
    <div className="flex flex-col gap-4">
      <PageHeader>{user.name}</PageHeader>
      <div className="flex flex-col lg:max-w-lg">
        <Form data={user} session={session!} />
      </div>
    </div>
  );
}
