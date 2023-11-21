"use client";
import FormFieldLoader from "~/components/Loaders/FormFieldLoader";
import { useParams } from "next/navigation";
import ID from "~/components/ID";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  const { id } = useParams();
  return (
    <div className="space-y-[22px] lg:max-w-lg">
      <div className="flex gap-2 items-center">
        <ID className="text-3xl text-slate-400">{id}</ID>
        <Skeleton className="w-[300px] h-7" />
      </div>
      <FormFieldLoader hasDescription />
      <FormFieldLoader hasDescription />
    </div>
  );
}
