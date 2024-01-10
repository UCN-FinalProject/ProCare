import "~/styles/globals.css";

import { headers } from "next/headers";
import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/providers/ThemeProvider";
import { Toaster } from "sonner";
import { getSession } from "next-auth/react";
import ClientSessionProvider from "~/providers/SessionProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { env } from "~/env.mjs";

export const metadata = {
  title: "ProCare",
  description: "Pro Care",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({ subsets: ["latin"] });

const session = await getSession();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientSessionProvider session={session!}>
            <Toaster closeButton />
            <TRPCReactProvider headers={headers()}>
              {children}
              {env.NODE_ENV === "production" && (
                <>
                  <Analytics />
                  <SpeedInsights />
                </>
              )}
            </TRPCReactProvider>
          </ClientSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
