import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { type Doctor } from "~/server/db/export";
import ID from "~/components/ID";
import CopyToClipboard from "~/components/util/CopyToClipboard";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";

export default function TableDoctors({ data }: { data: Doctor[] }) {
  return (
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
          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center h-32 text-muted-foreground"
              >
                No doctors
              </TableCell>
            </TableRow>
          )}
          {data.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell className="w-fit">
                <CopyToClipboard text={String(doctor.id)}>
                  <ID>{doctor.id}</ID>
                </CopyToClipboard>
              </TableCell>
              <TableCell>
                <CopyToClipboard text={doctor.doctorID}>
                  {doctor.doctorID}
                </CopyToClipboard>
              </TableCell>
              <TableCell className="font-medium">
                <Link href={`/insurance-providers/${doctor.id}`}>
                  <CopyToClipboard text={doctor.fullName}>
                    {doctor.fullName}
                  </CopyToClipboard>
                </Link>
              </TableCell>
              <TableCell>
                <Badge
                  variant={doctor.isActive === true ? "active" : "inactive"}
                >
                  {doctor.isActive === true ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
