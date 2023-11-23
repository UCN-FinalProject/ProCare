const browserPatterns = [
  { pattern: /MSIE|Trident/i, name: "Internet Explorer" },
  { pattern: /Edge/i, name: "Microsoft Edge" },
  { pattern: /Firefox/i, name: "Mozilla Firefox" },
  { pattern: /Safari/i, name: "Apple Safari" },
  { pattern: /Chrome/i, name: "Google Chrome" },
  { pattern: /Opera/i, name: "Opera" },
] as const;

export function getBrowserName(
  userAgent: string,
): (typeof browserPatterns)[number]["name"] | undefined {
  for (const browserPattern of browserPatterns) {
    if (browserPattern.pattern.test(userAgent)) return browserPattern.name;
  }

  return undefined;
}
