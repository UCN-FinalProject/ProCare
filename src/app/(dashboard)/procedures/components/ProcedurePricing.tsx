import React from "react";
import PageHeader from "~/components/Headers/PageHeader";
import ProcedurePricingCard from "./ProcedurePricingCard";
import type { HealthInsuranceList, ProcedurePricing } from "~/server/db/export";

type ProcedurePricingProps =
  | {
      variant: "update";
      procedurePricing: ProcedurePricingWithHealthInsurance[];
    }
  | {
      variant: "create";
      data: HealthInsuranceList[];
    };

export type ProcedurePricingWithHealthInsurance = ProcedurePricing & {
  healthInsurance: HealthInsuranceList;
};

export default function ProcedurePricing(props: ProcedurePricingProps) {
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex gap-3 items-center">
        <PageHeader className="text-2xl">Pricing</PageHeader>
      </div>
      {props.variant === "update"
        ? props.procedurePricing.map((pricing) => (
            <ProcedurePricingCard
              key={pricing.id}
              data={pricing}
              variant="update"
            />
          ))
        : props.data.map((healthInsurance) => (
            <ProcedurePricingCard
              key={healthInsurance.id}
              data={healthInsurance}
              variant="create"
            />
          ))}
    </div>
  );
}
