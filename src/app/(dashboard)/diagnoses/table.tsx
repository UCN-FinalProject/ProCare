import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { type HealthCondition } from "~/server/db/export";
import ID from "~/components/ID";
import CopyToClipboard from "~/components/util/CopyToClipboard";
import Link from "next/link";

export default function TableHealthConditions({
  data,
}: {
  data: HealthCondition[];
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-800">
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center h-32 text-muted-foreground"
              >
                No health conditions
              </TableCell>
            </TableRow>
          )}
          {data.map((healthCondition) => (
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
  );
}
