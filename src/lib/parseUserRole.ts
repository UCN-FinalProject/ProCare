export const roleArr = ["admin", "user", "all"] as const;
export type Role = (typeof roleArr)[number];

export function parseRole(status: string | undefined) {
  switch (status) {
    case "admin":
      return "admin";
    case "user":
      return "user";
    default:
      return undefined;
  }
}
