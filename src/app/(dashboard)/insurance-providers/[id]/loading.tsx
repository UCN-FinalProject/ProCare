"use client";
import PageHeader from "~/components/Headers/PageHeader";
import { useParams } from "next/navigation";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  const { id } = useParams();
  return (
    <div className="flex flex-col gap-4">
      <PageHeader>Insurance provider {String(id)}</PageHeader>
      <Skeleton className="h-5" />
    </div>
  );
}
