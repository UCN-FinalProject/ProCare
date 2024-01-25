import React, { Suspense } from "react";
import PageHeader from "~/components/Headers/PageHeader";
import { getServerAuthSession } from "~/server/auth";
import Form from "./components/form";
import { api } from "~/trpc/server";
import { RegisterpasskeyRSC } from "./components/RegisterPasskeyRSC";
import Table from "./components/table";
import LoadingPassKeys from "./components/LoadingPasskeys";

export default async function page() {
  const session = await getServerAuthSession();
  const user = await api.user.getByID({ id: session!.user.id });
  return (
    <div className="flex flex-col gap-8 overflow-hidden">
      <div className="flex flex-col gap-4">
        <PageHeader>Account settings</PageHeader>
        <div className="flex flex-col lg:max-w-lg">
          <Form data={user} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Suspense fallback={<LoadingPassKeys />}>
          <div className="flex justify-between">
            <PageHeader className="text-2xl">PassKeys</PageHeader>
            <RegisterpasskeyRSC />
          </div>
          <Table userID={user.id} />
        </Suspense>
      </div>
    </div>
  );
}
