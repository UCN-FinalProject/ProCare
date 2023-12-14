export const statusArr = ["active", "inactive", "all"] as const;
export type Status = (typeof statusArr)[number];

export function parseStatus(status: string | undefined) {
  switch (status) {
    case "active":
      return true;
    case "inactive":
      return false;
    default:
      return undefined;
  }
}
