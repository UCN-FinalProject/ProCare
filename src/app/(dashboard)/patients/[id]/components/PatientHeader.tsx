"use client";
import { Badge } from "~/components/ui/badge";
import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import PageHeader from "~/components/Headers/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import PatientAlert from "./PatientAlert";
import { Separator } from "~/components/ui/separator";

type Tabs = "details" | "conditions" | "procedures" | "documents";
export default function PatientHeader({
  id,
  fullName,
  isActive,
  isAdmin,
}: Readonly<{
  id: string;
  fullName: string;
  isActive: boolean;
  isAdmin: boolean;
}>) {
  const segments = [
    "details",
    "conditions",
    "procedures",
    "documents",
  ] as const;
  const router = useRouter();
  const path = usePathname();

  const getTab = (): (typeof segments)[number] => {
    if (path.includes("details")) return "details";
    if (path.includes("conditions")) return "conditions";
    if (path.includes("procedures")) return "procedures";
    if (path.includes("documents")) return "documents";
    return "details";
  };

  const [activeTab, setActiveTab] = useState<Tabs>(getTab);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <PageHeader>{fullName}</PageHeader>
          <Badge variant={isActive === true ? "active" : "inactive"}>
            {isActive === true ? "active" : "inactive"}
          </Badge>
        </div>
        {isAdmin && (
          <PatientAlert
            variant={isActive === true ? "active" : "inactive"}
            id={id}
          />
        )}
      </div>
      <Tabs defaultValue="account" className="w-fit" value={activeTab}>
        <TabsList>
          <TabsTrigger
            value="details"
            onClick={() => {
              setActiveTab("details");
              router.push(`/patients/${id}`);
            }}
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="conditions"
            onClick={() => {
              setActiveTab("conditions");
              router.push(`/patients/${id}/conditions`);
            }}
          >
            Conditions
          </TabsTrigger>
          <TabsTrigger
            value="procedures"
            onClick={() => {
              setActiveTab("procedures");
              router.push(`/patients/${id}/procedures`);
            }}
          >
            Procedures
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            onClick={() => {
              setActiveTab("documents");
              router.push(`/patients/${id}/documents`);
            }}
          >
            Documents
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Separator />
    </div>
  );
}
