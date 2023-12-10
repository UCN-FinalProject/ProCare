"use client";
import PageHeader from "../Headers/PageHeader";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import FormFieldLoader from "./FormFieldLoader";

export function ProcedurePricingCardLoader() {
  return (
    <div className="space-y-[11px]">
      <PageHeader className="text-2xl">Pricing</PageHeader>
      <Card>
        <div className="space-y-3">
          <CardHeader>
            <div className="flex gap-2 items-center">
              <CardTitle>
                <Skeleton className="w-[300px] h-5" />
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormFieldLoader />
            <FormFieldLoader />
          </CardContent>
        </div>
        <CardFooter>
          <Skeleton className="w-20 h-10" />
        </CardFooter>
      </Card>
    </div>
  );
}
