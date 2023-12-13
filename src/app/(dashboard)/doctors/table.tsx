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
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/server";
import Filters from "./Filters";
import Pagination from "~/components/Pagination";
import type { Session } from "next-auth";
import { parseStatus } from "~/lib/parseStatus";

export default async function TableDoctors({
  name,
  doctorid,
  status,
  page,
  session,
}: Readonly<{
  name?: string;
  doctorid?: string;
  status?: string;
  page: number;
  session: Session;
}>) {
  const doctors = await api.doctor.getMany.query({
    limit: 15,
    offset: (page - 1) * 15,
    name,
    doctorID: doctorid,
    isActive: session.user.role === "admin" ? parseStatus(status) : true,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table filters={<Filters />}>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Doctor ID</TableHead>
              {session.user.role === "admin" && (
                <TableHead className="text-center">Status</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.result.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center h-32 text-muted-foreground"
                >
                  No doctors
                </TableCell>
              </TableRow>
            )}
            {doctors.result.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell className="w-fit">
                  <CopyToClipboard text={String(doctor.id)}>
                    <ID>{doctor.id}</ID>
                  </CopyToClipboard>
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/doctors/${doctor.id}`}>
                    <CopyToClipboard text={doctor.fullName}>
                      {doctor.fullName}
                    </CopyToClipboard>
                  </Link>
                </TableCell>
                <TableCell>
                  <CopyToClipboard text={doctor.doctorID}>
                    {doctor.doctorID}
                  </CopyToClipboard>
                </TableCell>
                {session.user.role === "admin" && (
                  <TableCell align="center">
                    <Badge
                      variant={doctor.isActive === true ? "active" : "inactive"}
                    >
                      {doctor.isActive === true ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        limit={doctors.limit}
        offset={doctors.offset}
        total={doctors.total}
        result={doctors.result.length}
      />
    </div>
  );
}
