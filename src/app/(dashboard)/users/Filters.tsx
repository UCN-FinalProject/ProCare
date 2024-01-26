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
import { roleArr, type Role } from "~/lib/parseUserRole";
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
  const { replace } = useRouter(); // eslint-disable-line @typescript-eslint/unbound-method

  const onSubmit = useDebouncedCallback(
    ({
      name,
      email,
      role,
    }: {
      name?: string;
      email?: string;
      role?: string;
    }) => {
      const params = new URLSearchParams(searchParams);

      params.set("page", "1");

      if (role && roleArr.includes(role as Role) && isAdmin)
        params.set("role", role);
      else params.delete("role");

      if (name) params.set("name", name);
      else params.delete("name");

      if (email) params.set("email", email);
      else params.delete("email");

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
          const email = searchParams.get("email")?.toString();
          const role = searchParams.get("role")?.toString();
          onSubmit({ name: e.target.value.trim(), email, role });
        }}
        defaultValue={searchParams.get("name")?.toString()}
      />
      <Input
        disabled={isLoading}
        placeholder="Email"
        className="w-[200px] h-1/3"
        onChange={(e) => {
          const name = searchParams.get("name")?.toString();
          const role = searchParams.get("role")?.toString();
          onSubmit({ name, email: e.target.value.trim(), role });
        }}
        defaultValue={searchParams.get("email")?.toString()}
      />
      {isAdmin && (
        <Select
          disabled={isLoading}
          onValueChange={(value) => {
            const name = searchParams.get("name")?.toString();
            const email = searchParams.get("email")?.toString();
            onSubmit({ name, email, role: value });
          }}
          defaultValue={searchParams.get("role")?.toString() ?? "all"}
        >
          <SelectTrigger className="w-[200px] h-[27.5px] text-muted-foreground">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      )}
    </>
  );
}
