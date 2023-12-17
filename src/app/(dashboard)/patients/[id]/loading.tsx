"use client";
import FormFieldLoader from "~/components/Loaders/FormFieldLoader";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mt-1.5 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between w-full">
          <Skeleton className="w-[300px] h-7" />
          <Skeleton className="w-[110px] h-9" />
        </div>
        <Skeleton className="w-[200px] h-7" />
        <Separator />
      </div>
      <div className="flex flex-col lg:max-w-lg gap-4">
        {Array.from({ length: 2 }).map((_) => (
          <FormFieldLoader key={crypto.randomUUID()} />
        ))}
        <FormFieldLoader hasDescription />
        {Array.from({ length: 6 }).map((_) => (
          <FormFieldLoader key={crypto.randomUUID()} />
        ))}
      </div>
    </div>
  );
}
