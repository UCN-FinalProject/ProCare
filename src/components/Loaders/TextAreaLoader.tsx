import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function TextAreaLoader({
  hasDescription,
}: {
  hasDescription?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-[62px]" />
      {hasDescription && <Skeleton className="h-3 w-48" />}
    </div>
  );
}
