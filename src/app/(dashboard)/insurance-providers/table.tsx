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

export default async function TableDemo({
  name,
  registeredID,
  status,
  page,
  session,
}: Readonly<{
  name?: string;
  registeredID?: number;
  status?: string;
  page: number;
  session: Session;
}>) {
  const insuranceProviders = await api.healthInsurance.getMany.query({
    limit: 15,
    offset: (page - 1) * 15,
    name,
    registeredID,
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
              <TableHead>Registered ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Price per credit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {insuranceProviders.result.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-32 text-muted-foreground"
                >
                  No insurance providers
                </TableCell>
              </TableRow>
            )}
            {insuranceProviders.result.map((healthInsurance) => (
              <TableRow key={healthInsurance.insuranceID}>
                <TableCell className="w-fit">
                  <CopyToClipboard text={String(healthInsurance.insuranceID)}>
                    <ID>{healthInsurance.insuranceID}</ID>
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
                  <CopyToClipboard text={String(healthInsurance.registeredID)}>
                    {healthInsurance.registeredID}
                  </CopyToClipboard>
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
      <Pagination
        limit={insuranceProviders.limit}
        offset={insuranceProviders.offset}
        total={insuranceProviders.total}
        result={insuranceProviders.result.length}
      />
    </div>
  );
}
