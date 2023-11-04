import React from "react";
import { cn } from "~/lib/utils";

type Props = {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"h1">;

export default function PageHeader(props: Props) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-3xl font-bold tracking-tight w-fit",
        props.className,
      )}
    >
      {props.children}
    </h1>
  );
}
