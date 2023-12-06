import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "~/components/ui/table";
  import { type PatientWithoutCondition } from "~/server/db/export";
  import ID from "~/components/ID";
  import CopyToClipboard from "~/components/util/CopyToClipboard";
  import Link from "next/link";
  import { Badge } from "~/components/ui/badge";
  
  export default function TableDoctors({ data }: { data: PatientWithoutCondition[] }) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Biological Sex</TableHead>
              <TableHead>City</TableHead>
              <TableHead>ZipCode</TableHead>
              <TableHead>Main Address</TableHead>
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
                  No patients
                </TableCell>
              </TableRow>
            )}
            {data.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="w-fit">
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
                <TableCell align="right">
                  <Badge
                    variant={patient.isActive === true ? "active" : "inactive"}
                  >
                    {patient.isActive === true ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  