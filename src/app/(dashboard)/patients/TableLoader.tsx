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
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table filters={<Filters isLoading />}>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Biological Sex</TableHead>
              <TableHead>City</TableHead>
              <TableHead>ZipCode</TableHead>
              <TableHead>Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_) => (
              <RowLoading key={crypto.randomUUID()} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function RowLoading() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      {Array.from({ length: 5 }).map((_) => (
        <TableCell key={crypto.randomUUID()}>
          <Skeleton className="h-4" />
        </TableCell>
      ))}
    </TableRow>
  );
}
