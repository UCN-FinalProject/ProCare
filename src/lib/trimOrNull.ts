export function trimOrNull(str: string | null | undefined): string | null {
  if (str === null || str === undefined || str === "") return null;
  return str.trim();
}
