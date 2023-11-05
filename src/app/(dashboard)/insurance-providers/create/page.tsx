import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import Form from "./form";

export default async function Page() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // TODO: return 404 if user is not admin
  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <PageHeader>New insurance provider</PageHeader>
      <div className="flex flex-col lg:max-w-lg">
        <Form />
      </div>
    </div>
  );
}
