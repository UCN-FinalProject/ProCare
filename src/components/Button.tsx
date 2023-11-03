import React from "react";
import { Button, type ButtonProps } from "./ui/button";
import { Loader } from "lucide-react";
import { cn } from "~/lib/utils";

type Props = ButtonProps & {
  isLoading?: boolean;
};

export default function ButtonReusable({ isLoading, ...props }: Props) {
  return (
    <Button {...props} className={cn(props.className)}>
      {isLoading && (
        <Loader className="animate-spin-slow mr-1.5 w-4 text-muted-foreground" />
      )}
      {props.children}
    </Button>
  );
}
