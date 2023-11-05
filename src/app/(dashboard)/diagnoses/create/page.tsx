import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import Form from "./form";

export default function Page() {
  // TODO: return 404 if user is not admin
  return (
    <div className="flex flex-col gap-4">
      <PageHeader>New health condition</PageHeader>
      <div className="flex flex-col lg:max-w-lg">
        <Form />
      </div>
    </div>
  );
}
