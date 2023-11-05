import { TRPCError } from "@trpc/server";

export function parseErrorMessage({
  error,
  defaultMessage,
}: {
  error: unknown;
  defaultMessage: string;
}) {
  if (error instanceof Error) {
    return error.message;
  } else if (error instanceof TRPCError) {
    return error.message;
  } else {
    return defaultMessage;
  }
}
