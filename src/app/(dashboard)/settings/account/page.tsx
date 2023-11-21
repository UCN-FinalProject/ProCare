import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import { getServerAuthSession } from "~/server/auth";
import Form from "./form";
import { api } from "~/trpc/server";
import { RegisterpasskeyRSC } from "./components/RegisterPasskeyRSC";

export default async function page() {
  const session = await getServerAuthSession();
  const user = await api.user.getByID.query({ id: session!.user.id });
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <PageHeader>Account settings</PageHeader>
        <div className="flex flex-col lg:max-w-lg">
          <Form data={user} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <PageHeader className="text-2xl">PassKeys</PageHeader>
          <RegisterpasskeyRSC />
        </div>
      </div>
    </div>
  );
}
