import React from "react";
import DownloadButton from "./DownloadButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const variant = [
  {
    document: "ProcedureReport",
    title: "Procedure Report",
    description: "A comprehensive procedure report.",
    content:
      "Detailed procedure report including all procedures performed within selected period of time.",
  },
  {
    document: "TreatmentEndReport",
    title: "Treatment End Report",
    description: "A comprehensive treatment end report.",
    content: "Detailed treatment end report including all necessary data.",
  },
  {
    document: "TreatmentLog",
    title: "Treatment Log",
    description: "A comprehensive treatment log.",
    content: "Detailed treatment log including all treatment data.",
  },
  {
    document: "TreatmentPlan",
    title: "Treatment Plan",
    description: "A comprehensive treatment plan.",
    content: "Detailed treatment plan specific to the patient.",
  },
  {
    document: "TreatmentProposal",
    title: "Treatment Proposal",
    description: "A comprehensive treatment proposal.",
    content:
      "Detailed treatment proposal including suggested treatment, schedule and cost.",
  },
] as const;

export default function ReportCard({
  report,
}: Readonly<{
  report: (typeof variant)[number]["document"];
}>) {
  const { title, description, content } =
    variant.find((item) => item.document === report) ?? variant[0];
  return (
    <Card className="flex-shrink-0 w-full md:w-[48%] lg:w-[31.6%] xl:w-[32%] p-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm relaxed">{content}</p>
      </CardContent>
      <CardFooter>
        <DownloadButton report={report} />
      </CardFooter>
    </Card>
  );
}
