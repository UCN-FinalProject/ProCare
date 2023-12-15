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
import { parseStatus } from "~/lib/parseStatus";
import Filters from "./Filters";
import Pagination from "~/components/Pagination";

export default async function TablePatients({
  name,
  status,
  page,
  session,
}: Readonly<{
  name?: string;
  status?: string;
  page: number;
  session: Session;
}>) {
  const isAdmin = session.user.role === "admin";
  const patients = await api.patient.getMany.query({
    limit: 15,
    offset: (page - 1) * 15,
    name,
    isActive: isAdmin ? parseStatus(status) : true,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table filters={<Filters />}>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Biological Sex</TableHead>
              <TableHead>City</TableHead>
              <TableHead>ZipCode</TableHead>
              <TableHead>Address</TableHead>
              {isAdmin && <TableHead className="text-center">Status</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.result.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 7 : 6}
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
                <TableCell className="font-medium">
                  <CopyToClipboard text={patient.biologicalSex}>
                    {patient.biologicalSex}
                  </CopyToClipboard>
                </TableCell>
                <TableCell className="font-medium">
                  <CopyToClipboard text={patient.address?.city ?? ""}>
                    {patient.address?.city}
                  </CopyToClipboard>
                </TableCell>
                <TableCell className="font-medium">
                  <CopyToClipboard text={patient.address?.zipCode ?? ""}>
                    {patient.address?.zipCode}
                  </CopyToClipboard>
                </TableCell>
                <TableCell className="font-medium">
                  <CopyToClipboard text={patient.address?.address1 ?? ""}>
                    {patient.address?.address1}
                  </CopyToClipboard>
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
