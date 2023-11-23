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
import { getBrowserName } from "~/lib/parseUserAgent";
import { api } from "~/trpc/server";
import NullOrUndefined from "~/components/util/NullOrUndefined";

export default async function PassKeysTable({ userID }: { userID: string }) {
  const credentials = await api.user.getCredentialsByUserID.query({
    id: userID,
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-800">
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Browser</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {credentials.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center h-32 text-muted-foreground"
              >
                No credentials
              </TableCell>
            </TableRow>
          )}
          {credentials.map((credential) => (
            <TableRow key={credential.id}>
              <TableCell className="w-fit">
                <CopyToClipboard text={credential.id}>
                  <ID>{credential.id}</ID>
                </CopyToClipboard>
              </TableCell>
              <TableCell>
                {(credential.browserDetails &&
                  getBrowserName(credential.browserDetails)) ?? (
                  <NullOrUndefined />
                )}
              </TableCell>
              <TableCell>
                {credential.createdAt ? (
                  credential.createdAt.toLocaleString()
                ) : (
                  <NullOrUndefined />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
