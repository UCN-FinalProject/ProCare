"use client";
import FormFieldLoader from "~/components/Loaders/FormFieldLoader";
import TextAreaLoader from "~/components/Loaders/TextAreaLoader";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-[28px] lg:max-w-lg">
      <Skeleton className="w-[300px] h-7" />
      <FormFieldLoader hasDescription />
      <FormFieldLoader hasDescription />
      <TextAreaLoader />
    </div>
  );
}
