import "~/styles/globals.css";

import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/providers/ThemeProvider";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import { getSession } from "next-auth/react";
import ClientSessionProvider from "~/providers/SessionProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "ProCare",
  description: "Pro Care",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const session = await getSession();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientSessionProvider session={session!}>
            <Toaster closeButton />
            <TRPCReactProvider headers={headers()}>
              {children}
              <Analytics />
              <SpeedInsights />
            </TRPCReactProvider>
          </ClientSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
