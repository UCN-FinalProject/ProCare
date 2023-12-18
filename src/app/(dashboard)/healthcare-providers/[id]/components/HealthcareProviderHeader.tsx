"use client";
import { Badge } from "~/components/ui/badge";
import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import PageHeader from "~/components/Headers/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import HealthcareProviderAlert from "./HealthcareProviderAlert";
import { Separator } from "~/components/ui/separator";

type Tabs = "details" | "doctors";
export default function HealthCareProviderHeader({
  id,
  name,
  isActive,
  isAdmin,
}: Readonly<{
  id: number;
  name: string;
  isActive: boolean;
  isAdmin: boolean;
}>) {
  const segments = ["details", "doctors"] as const;
  const router = useRouter();
  const path = usePathname();

  const getTab = (): (typeof segments)[number] => {
    if (path.includes("details")) return "details";
    if (path.includes("doctors")) return "doctors";
    return "details";
  };

  const [activeTab, setActiveTab] = useState<Tabs>(getTab);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <PageHeader>{name}</PageHeader>
          <Badge variant={isActive === true ? "active" : "inactive"}>
            {isActive === true ? "active" : "inactive"}
          </Badge>
        </div>
        {isAdmin && (
          <HealthcareProviderAlert
            variant={isActive === true ? "active" : "inactive"}
            id={id}
          />
        )}
      </div>
      <Tabs defaultValue="details" className="w-fit" value={activeTab}>
        <TabsList>
          <TabsTrigger
            value="details"
            onClick={() => {
              setActiveTab("details");
              router.push(`/healthcare-providers/${id}`);
            }}
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="doctors"
            onClick={() => {
              setActiveTab("doctors");
              router.push(`/healthcare-providers/${id}/doctors`);
            }}
          >
            Doctors
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Separator />
    </div>
  );
}
