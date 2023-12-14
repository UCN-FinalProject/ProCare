"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Input } from "~/components/ui/input";
import { useDebouncedCallback } from "use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useSession } from "next-auth/react";
import { statusArr, type Status } from "~/lib/parseStatus";

export default function Filters({
  isLoading,
}: Readonly<{
  isLoading?: boolean;
}>) {
  const session = useSession();
  const isAdmin = session?.data?.user?.role;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { replace } = useRouter();

  const onSubmit = useDebouncedCallback(
    ({
      name,
      registeredID,
      status,
    }: {
      name?: string;
      registeredID?: string;
      status?: string;
    }) => {
      const params = new URLSearchParams(searchParams);

      params.set("page", "1");

      if (status && statusArr.includes(status as Status) && isAdmin === "admin")
        params.set("status", status);
      else params.delete("status");

      if (name) params.set("name", name);
      else params.delete("name");

      if (registeredID) params.set("registeredid", registeredID);
      else params.delete("registeredid");

      replace(`${pathname}?${params.toString()}`);
    },
    300,
  );

  return (
    <>
      <Input
        disabled={isLoading}
        placeholder="Name"
        className="w-[200px] h-1/3"
        onChange={(e) => {
          const registeredID = searchParams.get("registeredid")?.toString();
          const status = searchParams.get("status")?.toString();
          onSubmit({ name: e.target.value.trim(), registeredID, status });
        }}
        defaultValue={searchParams.get("name")?.toString()}
      />
      <Input
        disabled={isLoading}
        placeholder="Registered ID"
        className="w-[200px] h-1/3"
        onChange={(e) => {
          const name = searchParams.get("name")?.toString();
          const status = searchParams.get("status")?.toString();
          onSubmit({ name, registeredID: e.target.value.trim(), status });
        }}
        defaultValue={searchParams.get("registeredid")?.toString()}
      />
      {isAdmin === "admin" && (
        <Select
          disabled={isLoading}
          onValueChange={(value) => {
            const name = searchParams.get("name")?.toString();
            const registeredID = searchParams.get("registeredid")?.toString();
            onSubmit({ name, registeredID, status: value });
          }}
          defaultValue={
            searchParams.get("status")?.toString() ?? isAdmin === "admin"
              ? "all"
              : "active"
          }
        >
          <SelectTrigger className="w-[200px] h-[27.5px] text-muted-foreground">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      )}
    </>
  );
}
