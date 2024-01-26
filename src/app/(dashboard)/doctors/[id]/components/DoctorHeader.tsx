"use client";
import { Badge } from "~/components/ui/badge";
import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import PageHeader from "~/components/Headers/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import DoctorAlert from "./DoctorAlert";

type Tabs = "details" | "patients" | "healthCareProviders";
export default function DoctorHeader({
  id,
  fullName,
  isActive,
  isAdmin,
}: Readonly<{
  id: number;
  fullName: string;
  isActive: boolean;
  isAdmin: boolean;
}>) {
  const segments = ["details", "patients", "healthCareProviders"] as const;
  const router = useRouter();
  const path = usePathname();

  const getTab = (): (typeof segments)[number] => {
    if (path.includes("details")) return "details";
    if (path.includes("patients")) return "patients";
    if (path.includes("healthCareProviders")) return "healthCareProviders";
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
          <DoctorAlert
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
              router.push(`/doctors/${id}`);
            }}
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="patients"
            onClick={() => {
              setActiveTab("patients");
              router.push(`/doctors/${id}/patients`);
            }}
          >
            Patients
          </TabsTrigger>
          <TabsTrigger
            value="healthCareProviders"
            onClick={() => {
              setActiveTab("healthCareProviders");
              router.push(`/doctors/${id}/healthcareproviders`);
            }}
          >
            HealthCare Providers
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Separator />
    </div>
  );
}
