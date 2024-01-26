import { notFound } from "next/navigation";
import React from "react";
import Form from "./components/form";
import { getServerAuthSession } from "~/server/auth";
import { GetDoctor } from "./layout";

export default async function page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const [doctor, session] = await Promise.all([
    GetDoctor(id).catch(() => notFound()),
    getServerAuthSession(),
  ]);

  return (
    <div className="flex flex-col lg:max-w-lg">
      <Form doctor={doctor} session={session!} />
    </div>
  );
}
