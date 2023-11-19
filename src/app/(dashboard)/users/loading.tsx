import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between">
        <PageHeader>Users</PageHeader>
        <Skeleton className="w-28 h-8" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Doctor ID</TableHead>
              <TableHead className="text-center">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <RowLoading />
            <RowLoading />
            <RowLoading />
            <RowLoading />
            <RowLoading />
            <RowLoading />
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function RowLoading() {
  return (
    <TableRow>
      <TableCell className="w-fit">
        <Skeleton className="h-4 w-28" />
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
      <TableCell>
        <Skeleton className="h-4" />
      </TableCell>
      <TableCell align="center">
        <Skeleton className="h-4" />
      </TableCell>
    </TableRow>
  );
}
