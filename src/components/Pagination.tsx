"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Button from "./Button";

type Props = {
  limit: number;
  offset: number;
  total: number;
  result: number;
};

export default function Pagination(props: Props) {
  //   console.log(props);
  const { limit, offset, total, result } = props;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { replace } = useRouter();

  const currentPage =
    Number(searchParams.get("page")) > 0 ? Number(searchParams.get("page")) : 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex w-full justify-between gap-x-4">
      {result > 0 ? (
        <p className="text-primary opacity-80 text-sm">
          Showing {result > 0 ? 1 : offset + 1} to{" "}
          {currentPage * limit > total ? total : currentPage * limit} of {total}{" "}
          results
        </p>
      ) : (
        <p className="text-primary opacity-80 text-sm">No results</p>
      )}

      <div className="flex gap-1">
        <Button
          variant="outline"
          disabled={currentPage <= 1}
          onClick={() => createPageURL(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={currentPage * limit >= total}
          onClick={() => createPageURL(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
