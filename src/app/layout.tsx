import "~/styles/globals.css";

import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/providers/ThemeProvider";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "ProCare",
  description: "Pro Care",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster closeButton />
          <TRPCReactProvider headers={headers()}>
            {children}
            <Analytics />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
