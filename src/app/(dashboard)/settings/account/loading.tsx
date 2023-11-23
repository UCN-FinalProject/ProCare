"use client";
import FormFieldLoader from "~/components/Loaders/FormFieldLoader";
import PageHeader from "~/components/Headers/PageHeader";
import LoadingPassKeys from "./components/LoadingPasskeys";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8 overflow-hidden">
      <div className="space-y-[28px] lg:max-w-lg">
        <PageHeader>Account settings</PageHeader>
        <FormFieldLoader hasDescription />
        <FormFieldLoader hasDescription />
        <FormFieldLoader hasDescription />
        <FormFieldLoader hasDescription />
      </div>

      <LoadingPassKeys />
    </div>
  );
}
