"use client";
import { useSelectedLayoutSegments, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useSession } from "next-auth/react";

type Tabs = "tennant" | "account";
export default function Layout({ children }: { children: React.ReactNode }) {
  const session = useSession();

  const segments = useSelectedLayoutSegments();
  const [activeTab, setActiveTab] = useState<Tabs>(segments[0] as Tabs);
  const router = useRouter();

  useEffect(() => {
    setActiveTab(segments[0] as Tabs);
  }, [segments]);

  if (session.data?.user?.role !== "admin") return <>{children}</>;

  return (
    <>
      <Tabs defaultValue="account" className="w-fit" value={activeTab}>
        <TabsList>
          <TabsTrigger
            value="tennant"
            onClick={() => {
              setActiveTab("tennant");
              router.push("/settings/tennant");
            }}
          >
            Tennant
          </TabsTrigger>
          <TabsTrigger
            value="account"
            onClick={() => {
              setActiveTab("account");
              router.push("/settings/account");
            }}
          >
            Account
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {children}
    </>
  );
}
