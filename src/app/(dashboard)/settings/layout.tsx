"use client";
import { useSelectedLayoutSegments, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

type Tabs = "tennant" | "account";
export default function Layout({ children }: { children: React.ReactNode }) {
  const segments = useSelectedLayoutSegments();
  const [activeTab, setActiveTab] = useState<Tabs>(segments[0] as Tabs);
  const router = useRouter();

  //   TODO: return this only if user has admin role
  return (
    <div>
      <Tabs defaultValue="account" className="w-fit pb-4" value={activeTab}>
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
    </div>
  );
}
