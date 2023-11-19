import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { type User } from "~/server/db/export";
import ID from "~/components/ID";
import CopyToClipboard from "~/components/util/CopyToClipboard";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";

export default function TableDemo({ data }: { data: User[] }) {
  return (
    <div className="rounded-md border">
      <Table>
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
          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center h-32 text-muted-foreground"
              >
                No users
              </TableCell>
            </TableRow>
          )}
          {data.map((user) => (
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
              <TableCell>{user.doctorID}</TableCell>
              <TableCell align="center">
                <Badge variant="outline">{user.role}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
