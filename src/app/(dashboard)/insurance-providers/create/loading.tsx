"use client";
import { Separator } from "~/components/ui/separator";
import FormFieldLoader from "~/components/Loaders/FormFieldLoader";
import PageHeader from "~/components/Headers/PageHeader";

export default function Loading() {
  return (
    <div className="space-y-[22px] lg:max-w-lg">
      <PageHeader>New insurance provider</PageHeader>
      <FormFieldLoader hasDescription />
      <FormFieldLoader hasDescription />
      <FormFieldLoader />
      <FormFieldLoader />

      <Separator />

      <FormFieldLoader />
      <FormFieldLoader />

      <Separator />

      <FormFieldLoader />
      <FormFieldLoader />
      <FormFieldLoader />
      <FormFieldLoader />
      <FormFieldLoader />
    </div>
  );
}
