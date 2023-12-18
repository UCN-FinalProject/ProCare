import React from "react";
import type { PatientConditionRes } from "./page";
import Link from "next/link";
import { Separator } from "~/components/ui/separator";
import NullOrUndefined from "~/components/util/NullOrUndefined";

export default function Procedure({
  procedure,
}: Readonly<{
  procedure: PatientConditionRes;
}>) {
  return (
    <div className="flex gap-8 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-all duration-150">
      <div className="flex flex-col text-muted-foreground text-xs font-light p-2 py-3">
        <p>{procedure.createdAt.toTimeString().slice(0, 5)}</p>
        <p>{procedure.createdAt.toLocaleDateString().split("T")[0]}</p>
      </div>

      <div className="flex flex-col relative">
        <Separator
          orientation="vertical"
          className=" bg-stone-200 dark:bg-stone-400"
        />
        <div className="h-3 w-3 rounded-full bg-stone-200 dark:bg-stone-400 absolute -left-[0.34rem]" />
      </div>

      <div className="flex flex-col justify-start items-start p-2">
        <h3 className="text-lg font-medium">
          <Link href={`/procedures/${procedure.id}`}>{procedure.name}</Link>
        </h3>
        {procedure.note && (
          <p className="text-md text-gray-800 dark:text-gray-300">
            {procedure.note}
          </p>
        )}
        {procedure.createdBy ? (
          <Link
            href={`/users/${procedure.createdBy.id}`}
            className="text-muted-foreground text-xs"
          >
            {procedure.createdBy?.name}
          </Link>
        ) : (
          <NullOrUndefined className="text-xs">Unknown</NullOrUndefined>
        )}
      </div>
    </div>
  );
}
