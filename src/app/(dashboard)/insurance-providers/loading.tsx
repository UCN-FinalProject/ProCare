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
      <PageHeader>Insurance providers</PageHeader>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Registered ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Price per credit</TableHead>
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
