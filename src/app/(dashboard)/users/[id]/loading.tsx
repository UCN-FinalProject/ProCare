"use client";
import FormFieldLoader from "~/components/Loaders/FormFieldLoader";
import PageHeader from "~/components/Headers/PageHeader";

export default function Loading() {
  return (
    <div className="space-y-[28px] lg:max-w-lg">
      <PageHeader>New user</PageHeader>
      <FormFieldLoader hasDescription />
      <FormFieldLoader hasDescription />
      <FormFieldLoader hasDescription />
      <FormFieldLoader hasDescription />
    </div>
  );
}
