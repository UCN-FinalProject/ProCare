import React from "react";
import type { PatientConditionRes } from "./page";
import NullOrUndefined from "~/components/util/NullOrUndefined";
import Link from "next/link";
import RemoveCondition from "./RemoveConditionDialog";
import type { Session } from "next-auth";

export default function Condition({
  condition,
  session,
}: Readonly<{
  condition: PatientConditionRes;
  session: Session;
}>) {
  const isAdmin = session.user.role === "admin";
  return (
    <div className="flex flex-col p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-all duration-150">
      <div className="w-full flex justify-between items-center">
        <div className="scroll-m-20 text-xl font-semibold tracking-tight w-fit">
          <Link href={`/diagnoses/${condition.id}`}>{condition.name}</Link>
        </div>
        {isAdmin && <RemoveCondition id={condition.id} session={session} />}
      </div>
      <p className="text-primary">{condition.description}</p>

      <div className="flex text-muted-foreground text-xs font-light">
        {condition.assignedBy?.name ? (
          <p>
            <Link href={`/users/${condition.assignedBy.id}`}>
              {condition.assignedBy.name}
            </Link>
          </p>
        ) : (
          <NullOrUndefined>Unknown</NullOrUndefined>
        )}
        ,&nbsp;
        {condition.assignedAt ? (
          <p>{condition.assignedAt.toLocaleDateString()}</p>
        ) : (
          <NullOrUndefined>Unknown</NullOrUndefined>
        )}
      </div>
    </div>
  );
}
