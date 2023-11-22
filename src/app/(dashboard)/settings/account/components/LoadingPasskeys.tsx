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

export default function LoadingPassKeys() {
  return (
    <>
      <div className="flex justify-between">
        <PageHeader className="text-2xl">PassKeys</PageHeader>
        <Skeleton className="w-28 h-8" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Browser</TableHead>
              <TableHead>Created</TableHead>
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
    </>
  );
}

function RowLoading() {
  return (
    <TableRow>
      <TableCell className="w-fit">
        <Skeleton className="h-4 w-52" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-full" />
      </TableCell>
    </TableRow>
  );
}
