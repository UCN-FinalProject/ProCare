"use client";
import FormFieldLoader from "~/components/Loaders/FormFieldLoader";
import TextAreaLoader from "~/components/Loaders/TextAreaLoader";
import ID from "~/components/ID";
import { Skeleton } from "~/components/ui/skeleton";
import { useParams } from "next/navigation";

export default function Loading() {
  const { id } = useParams();
  return (
    <div className="space-y-[28px] lg:max-w-lg">
      <div className="flex gap-2 items-center">
        <ID className="text-3xl text-slate-400">{id}</ID>
        <Skeleton className="w-[300px] h-7" />
      </div>
      <FormFieldLoader />
      <FormFieldLoader hasDescription />
      <FormFieldLoader hasDescription />
      <FormFieldLoader />
      <FormFieldLoader hasDescription />
      <FormFieldLoader />
      <FormFieldLoader />
      <TextAreaLoader />
    </div>
  );
}
