"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Input } from "~/components/ui/input";
import { useDebouncedCallback } from "use-debounce";

export default function Filters({
  isLoading,
}: Readonly<{ isLoading?: boolean }>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { replace } = useRouter();

  const onSubmit = useDebouncedCallback((values: string) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");
    if (values) params.set("name", values);
    else params.delete("name");

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Input
      disabled={isLoading}
      placeholder="Name"
      className="max-w-[200px] h-1/3"
      onChange={(e) => onSubmit(e.target.value.trim())}
      defaultValue={searchParams.get("name")?.toString()}
    />
  );
}
