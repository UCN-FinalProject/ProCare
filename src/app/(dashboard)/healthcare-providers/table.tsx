import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { type HealthcareProvider } from "~/server/db/export";
import ID from "~/components/ID";
import CopyToClipboard from "~/components/util/CopyToClipboard";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import NullOrUndefined from "~/components/util/NullOrUndefined";

export default function HealthcareProvidersTable({
  data,
}: {
  data: HealthcareProvider[];
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-800">
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Healthcare provider ID</TableHead>
            <TableHead>VAT</TableHead>
            <TableHead>Address 1</TableHead>
            <TableHead>Address 2</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Zip</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center h-32 text-muted-foreground"
              >
                No healthcare providers
              </TableCell>
            </TableRow>
          )}
          {data.map((healthcareProvider) => (
            <TableRow key={healthcareProvider.id}>
              <TableCell className="w-fit">
                <ID>{healthcareProvider.id}</ID>
              </TableCell>
              <TableCell className="font-medium">
                <Link
                  href={`/healthcare-providers/${String(
                    healthcareProvider.id,
                  )}`}
                >
                  <CopyToClipboard text={healthcareProvider.name}>
                    {healthcareProvider.name}
                  </CopyToClipboard>
                </Link>
              </TableCell>
              <TableCell>{healthcareProvider.healthcareProviderCode}</TableCell>
              <TableCell>{healthcareProvider.VAT}</TableCell>
              <TableCell>{healthcareProvider.address1}</TableCell>
              <TableCell>
                {healthcareProvider.address2 ?? (
                  <NullOrUndefined>None</NullOrUndefined>
                )}
              </TableCell>
              <TableCell>{healthcareProvider.city}</TableCell>
              <TableCell>{healthcareProvider.zip}</TableCell>
              <TableCell align="center">
                <Badge
                  variant={
                    healthcareProvider.isActive === true ? "active" : "inactive"
                  }
                >
                  {healthcareProvider.isActive === true ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
