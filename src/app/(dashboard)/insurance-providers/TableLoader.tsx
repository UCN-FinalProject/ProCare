import React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Filters from "./Filters";

export default function TableLoader() {
  return (
    <div className="rounded-md border">
      <Table filters={<Filters isLoading />}>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-800">
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Registered ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Price per credit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_) => (
            <RowLoading key={crypto.randomUUID()} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function RowLoading() {
  return (
    <TableRow>
      <TableCell className="w-fit">
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4" />
      </TableCell>
      <TableCell align="right">
        <Skeleton className="h-4" />
      </TableCell>
    </TableRow>
  );
}
