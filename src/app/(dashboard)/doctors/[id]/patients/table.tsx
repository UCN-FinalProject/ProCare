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
import type { Session } from "next-auth";
import Pagination from "~/components/Pagination";

export default async function TableDoctorPatients({
  doctorId,
  page,
  session,
}: Readonly<{
  doctorId: number;
  page: number;
  session: Session;
}>) {
  const isAdmin = session.user.role === "admin";
  const patients = await api.doctor.getPatients({
    doctorID: doctorId,
    limit: 15,
    offset: (page - 1) * 15,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead className="text-center">Biological Sex</TableHead>
              {isAdmin && <TableHead className="text-center">Status</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.result.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center h-32 text-muted-foreground"
                >
                  No patients
                </TableCell>
              </TableRow>
            )}
            {patients.result.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="max-w-[100px] overflow-hidden">
                  <CopyToClipboard text={String(patient.id)}>
                    <ID>{patient.id}</ID>
                  </CopyToClipboard>
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/patients/${patient.id}`}>
                    <CopyToClipboard text={patient.fullName}>
                      {patient.fullName}
                    </CopyToClipboard>
                  </Link>
                </TableCell>
                <TableCell align="center">
                  <Badge
                    variant={
                      patient.biologicalSex === "male" ? "male" : "female"
                    }
                  >
                    {patient.biologicalSex}
                  </Badge>
                </TableCell>
                {isAdmin && (
                  <TableCell align="center">
                    <Badge
                      variant={
                        patient.isActive === true ? "active" : "inactive"
                      }
                    >
                      {patient.isActive === true ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        limit={patients.limit}
        offset={patients.offset}
        total={patients.total}
        result={patients.result.length}
      />
    </div>
  );
}
