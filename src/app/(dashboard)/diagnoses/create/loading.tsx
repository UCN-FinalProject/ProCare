"use client";
import FormFieldLoader from "~/components/Loaders/FormFieldLoader";
import PageHeader from "~/components/Headers/PageHeader";

export default function Loading() {
  return (
    <div className="space-y-[22px] lg:max-w-lg">
      <PageHeader>New health condition</PageHeader>
      <FormFieldLoader hasDescription />
      <FormFieldLoader hasDescription />
    </div>
  );
}
