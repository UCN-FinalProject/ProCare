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
import { statusArr, type Status } from "~/lib/parseStatus";
import type { Session } from "next-auth";

export default function Filters({
  isLoading,
  session,
}: Readonly<{
  isLoading?: boolean;
  session?: Session;
}>) {
  const isAdmin = session?.user?.role === "admin";
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { replace } = useRouter();

  const onSubmit = useDebouncedCallback(
    ({
      name,
      providerID,
      status,
    }: {
      name?: string;
      providerID?: string;
      status?: string;
    }) => {
      const params = new URLSearchParams(searchParams);

      params.set("page", "1");

      if (status && statusArr.includes(status as Status) && isAdmin)
        params.set("status", status);
      else params.delete("status");

      if (name) params.set("name", name);
      else params.delete("name");

      if (providerID) params.set("providerid", providerID);
      else params.delete("providerid");

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
          const providerID = searchParams.get("providerid")?.toString();
          const status = searchParams.get("status")?.toString();
          onSubmit({ name: e.target.value.trim(), providerID, status });
        }}
        defaultValue={searchParams.get("name")?.toString()}
      />
      <Input
        disabled={isLoading}
        placeholder="Doctor ID"
        className="w-[200px] h-1/3"
        onChange={(e) => {
          const name = searchParams.get("name")?.toString();
          const status = searchParams.get("status")?.toString();
          onSubmit({ name, providerID: e.target.value.trim(), status });
        }}
        defaultValue={searchParams.get("providerid")?.toString()}
      />
      {isAdmin && (
        <Select
          disabled={isLoading}
          onValueChange={(value) => {
            const name = searchParams.get("name")?.toString();
            const providerID = searchParams.get("providerid")?.toString();
            onSubmit({ name, providerID, status: value });
          }}
          defaultValue={
            searchParams.get("status")?.toString() ?? isAdmin ? "all" : "active"
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
