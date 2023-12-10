"use client";
import FormFieldLoader from "~/components/Loaders/FormFieldLoader";
import ID from "~/components/ID";
import { Skeleton } from "~/components/ui/skeleton";
import { useParams } from "next/navigation";
import { ProcedurePricingCardLoader } from "~/components/Loaders/ProcedurePricingCardLoader";

export default function Loading() {
  const { id } = useParams();
  return (
    <div className="space-y-[22px] lg:max-w-lg">
      <div className="flex gap-2 items-center">
        <ID className="text-3xl text-slate-400">{id}</ID>
        <Skeleton className="w-[300px] h-7" />
      </div>
      <FormFieldLoader hasDescription />
      <Skeleton className="w-20 h-10" />

      <ProcedurePricingCardLoader />
    </div>
  );
}
