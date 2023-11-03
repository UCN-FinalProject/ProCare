import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function FormFieldLoader({
  hasDescription,
}: {
  hasDescription?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-32 " />
      <Skeleton className="h-9 " />
      {hasDescription && <Skeleton className="h-3 w-48" />}
    </div>
  );
}
