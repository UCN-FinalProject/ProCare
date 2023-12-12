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
import NullOrUndefined from "~/components/util/NullOrUndefined";
import { api } from "~/trpc/server";
import Filters from "./Filters";
import type { Role } from "~/lib/parseUserRole";
import Pagination from "~/components/Pagination";

export default async function UsersTable({
  name,
  email,
  role,
  page,
}: Readonly<{
  name?: string;
  email?: string;
  role?: Role;
  page: number;
}>) {
  const users = await api.user.getMany.query({
    limit: 15,
    offset: (page - 1) * 15,
    name,
    email,
    role: role === "admin" || role === "user" ? role : undefined,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table filters={<Filters />}>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Doctor ID</TableHead>
              <TableHead className="text-center">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.result.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-32 text-muted-foreground"
                >
                  No users
                </TableCell>
              </TableRow>
            )}
            {users.result.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="w-fit">
                  <CopyToClipboard text={user.id}>
                    <ID>{user.id}</ID>
                  </CopyToClipboard>
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/users/${user.id}`}>
                    <CopyToClipboard text={user.name}>
                      {user.name}
                    </CopyToClipboard>
                  </Link>
                </TableCell>
                <TableCell>
                  <CopyToClipboard text={user.email}>
                    {user.email}
                  </CopyToClipboard>
                </TableCell>
                <TableCell>
                  <Badge variant={!!user.emailVerified ? "active" : "inactive"}>
                    {!!user.emailVerified === true ? "Verified" : "Unverified"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.doctorID ?? <NullOrUndefined>None</NullOrUndefined>}
                </TableCell>
                <TableCell align="center">
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        limit={users.limit}
        offset={users.offset}
        total={users.total}
        result={users.result.length}
      />
    </div>
  );
}
