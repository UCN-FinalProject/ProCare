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
        <PageHeader>Doctors</PageHeader>
        <Skeleton className="w-28 h-8" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Doctor ID</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <RowLoading />
            <RowLoading />
            <RowLoading />
            <RowLoading />
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
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[47px]" />
      </TableCell>
      <TableCell align="right">
        <Skeleton className="h-4 w-20" />
      </TableCell>
    </TableRow>
  );
}
