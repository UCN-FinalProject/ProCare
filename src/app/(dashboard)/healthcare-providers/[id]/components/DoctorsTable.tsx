import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import ID from "~/components/ID";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/server";
import type { Session } from "next-auth";
import RemoveDoctorDialog from "./RemoveDoctor";

export default async function DoctorsTable({
  session,
  providerID,
}: Readonly<{
  session: Session;
  providerID: number;
}>) {
  const isAdmin = session?.user.role === "admin";
  const doctors = await api.healthcareProvider.getDoctors({
    id: providerID,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Doctor ID</TableHead>
              <TableHead className="text-center">Status</TableHead>
              {isAdmin && (
                <TableHead className="text-center">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.result.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 5 : 4}
                  className="text-center h-32 text-muted-foreground"
                >
                  No doctors found
                </TableCell>
              </TableRow>
            )}
            {doctors.result.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell className="w-fit">
                  <ID>{doctor.id}</ID>
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/doctors/${doctor.id}`}>{doctor.fullName}</Link>
                </TableCell>
                <TableCell>{doctor.doctorID}</TableCell>

                {isAdmin && (
                  <TableCell align="center">
                    <Badge
                      variant={doctor.isActive === true ? "active" : "inactive"}
                    >
                      {doctor.isActive === true ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                )}
                {isAdmin && (
                  <TableCell align="center">
                    <RemoveDoctorDialog
                      doctorID={doctor.id}
                      providerID={providerID}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
