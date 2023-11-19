import React from "react";
import { api } from "~/trpc/server";

export default async function page({ params }: { params: { id: string } }) {
  const user = await api.user.getByID.query({ id: params.id });

  return (
    <div>
      {params.id}
      {JSON.stringify(user)}
    </div>
  );
}
