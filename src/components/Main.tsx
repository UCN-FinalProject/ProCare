"use client";
import { ReactNode } from "react";

export default function Main({ children }: { children: ReactNode }) {
  return (
    <main className="flex bg-background max-w-screen-xl flex-col space-y-12 p-8">
      {children}
    </main>
  );
}
