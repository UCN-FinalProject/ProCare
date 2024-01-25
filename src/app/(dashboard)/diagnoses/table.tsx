import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import ID from "~/components/ID";
import CopyToClipboard from "~/components/util/CopyToClipboard";
import Link from "next/link";
import { api } from "~/trpc/server";
import Filters from "../procedures/components/Filters";
import Pagination from "~/components/Pagination";

export default async function TableHealthConditions({
  name,
  page,
}: Readonly<{
  name?: string;
  page: number;
}>) {
  const healthConditions = await api.healthCondition.getMany({
    limit: 15,
    offset: (page - 1) * 15,
    name,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table filters={<Filters />}>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {healthConditions.result.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center h-32 text-muted-foreground"
                >
                  No health conditions
                </TableCell>
              </TableRow>
            )}
            {healthConditions.result.map((healthCondition) => (
              <TableRow key={healthCondition.id}>
                <TableCell className="w-fit">
                  <CopyToClipboard text={String(healthCondition.id)}>
                    <ID>{healthCondition.id}</ID>
                  </CopyToClipboard>
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/diagnoses/${healthCondition.id}`}>
                    <CopyToClipboard text="healthCondition.name">
                      {healthCondition.name}
                    </CopyToClipboard>
                  </Link>
                </TableCell>
                <TableCell>{healthCondition.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        limit={healthConditions.limit}
        offset={healthConditions.offset}
        total={healthConditions.total}
        result={healthConditions.result.length}
      />
    </div>
  );
}
