import React from "react";
import { getServerAuthSession } from "~/server/auth";

export default async function page() {
  const session = await getServerAuthSession();
  return (
    <div>
      {JSON.stringify(session?.user)}
      <p> Hello MotherFuckers</p>
    </div>
  );
}
