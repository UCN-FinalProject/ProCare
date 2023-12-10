import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { type Procedure } from "~/server/db/export";
import ID from "~/components/ID";
import CopyToClipboard from "~/components/util/CopyToClipboard";
import Link from "next/link";

export default function ProceduresTable({ data }: { data: Procedure[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-800">
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center h-32 text-muted-foreground"
              >
                No procedures
              </TableCell>
            </TableRow>
          )}
          {data.map((procedure) => (
            <TableRow key={procedure.id}>
              <TableCell className="w-fit">
                <ID>{procedure.id}</ID>
              </TableCell>
              <TableCell className="font-medium">
                {/* @ts-expect-error this route package aint paerfect */}
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
  );
}
