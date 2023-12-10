"use client";
import FormFieldLoader from "~/components/Loaders/FormFieldLoader";
import { Skeleton } from "~/components/ui/skeleton";
import { ProcedurePricingCardLoader } from "~/components/Loaders/ProcedurePricingCardLoader";
import PageHeader from "~/components/Headers/PageHeader";

export default function Loading() {
  return (
    <div className="space-y-[22px] lg:max-w-lg">
      <div className="flex gap-2 items-center">
        <PageHeader>New procedure</PageHeader>
      </div>
      <FormFieldLoader hasDescription />
      <Skeleton className="w-20 h-10" />

      <ProcedurePricingCardLoader />
    </div>
  );
}
