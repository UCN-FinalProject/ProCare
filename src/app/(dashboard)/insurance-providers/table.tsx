import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { type HealthInsuranceList } from "~/server/db/export";
import ID from "~/components/ID";
import CopyToClipboard from "~/components/util/CopyToClipboard";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";

export default function TableDemo({ data }: { data: HealthInsuranceList[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-800">
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Registered ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Price per credit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center h-32 text-muted-foreground"
              >
                No insurance providers
              </TableCell>
            </TableRow>
          )}
          {data.map((healthInsurance) => (
            <TableRow key={healthInsurance.insuranceID}>
              <TableCell className="w-fit">
                <CopyToClipboard text={String(healthInsurance.insuranceID)}>
                  <ID>{healthInsurance.insuranceID}</ID>
                </CopyToClipboard>
              </TableCell>
              <TableCell>
                <CopyToClipboard text={String(healthInsurance.registeredID)}>
                  {healthInsurance.registeredID}
                </CopyToClipboard>
              </TableCell>
              <TableCell className="font-medium">
                <Link href={`/insurance-providers/${healthInsurance.id}`}>
                  <CopyToClipboard text={healthInsurance.name}>
                    {healthInsurance.name}
                  </CopyToClipboard>
                </Link>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    healthInsurance.isActive === true ? "active" : "inactive"
                  }
                >
                  {healthInsurance.isActive === true ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {healthInsurance.pricePerCredit}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}