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
import Filters from "./components/Filters";
import Pagination from "~/components/Pagination";

export default async function ProceduresTable({
  name,
  page,
}: Readonly<{
  name?: string;
  page: number;
}>) {
  const procedures = await api.procedure.getMany.query({
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {procedures.result.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center h-32 text-muted-foreground"
                >
                  No procedures
                </TableCell>
              </TableRow>
            )}
            {procedures.result.map((procedure) => (
              <TableRow key={procedure.id}>
                <TableCell className="w-fit">
                  <ID>{procedure.id}</ID>
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/procedures/${String(procedure.id)}`}>
                    <CopyToClipboard text={procedure.name}>
                      {procedure.name}
                    </CopyToClipboard>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        limit={procedures.limit}
        offset={procedures.offset}
        total={procedures.total}
        result={procedures.result.length}
      />
    </div>
  );
}
