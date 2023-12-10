import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import ProcedurePricingForm from "./ProcedurePricingForm";
import ID from "~/components/ID";
import type { ProcedurePricingWithHealthInsurance } from "./ProcedurePricing";
import type { HealthInsuranceList } from "~/server/db/export";

export type ProcedurePricingFormVariant = "update" | "create";

type Props =
  | {
      variant: "update";
      data: ProcedurePricingWithHealthInsurance;
    }
  | {
      variant: "create";
      data: HealthInsuranceList;
    };

export default function HealthInsuranceProcedurePricing(props: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 items-center">
          <ID>
            {props.variant === "update"
              ? props.data.healthInsurance.insuranceID
              : props.data.insuranceID}
          </ID>
          <CardTitle>
            {props.variant === "update"
              ? props.data.healthInsurance.name
              : props.data.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {props.variant === "update" ? (
          <ProcedurePricingForm data={props.data} variant={props.variant} />
        ) : (
          <ProcedurePricingForm
            variant={props.variant}
            data={{
              healthInsuranceId: props.data.id,
              credits: 0,
              price: "0",
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
