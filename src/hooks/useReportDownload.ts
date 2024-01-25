"use client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export type ReportFile =
  | "ProcedureReport"
  | "TreatmentEndReport"
  | "TreatmentLog"
  | "TreatmentPlan"
  | "TreatmentProposal";

async function handleDownload({
  report,
  patientId,
}: {
  report: ReportFile;
  patientId: string;
}) {
  // Trigger the API endpoint to download the file
  const response = await fetch(
    `/api/reports?document=${report}&patientId=${patientId}`,
  );
  const data = await response.blob();

  // Create a Blob URL and initiate the download
  const url = window.URL.createObjectURL(data);
  // Create a link element to trigger the download
  const a = document.createElement("a");
  // Set the href and download attributes for the anchor element
  a.href = url;
  a.download = `${patientId}-${report}-${
    new Date().toLocaleDateString().split("T")[0]
  }.docx`;
  document.body.appendChild(a);
  a.click();
  // Remove the anchor element from the DOM
  document.body.removeChild(a);
}

export default function useReportDownload({
  report,
  patientId,
}: {
  report: ReportFile;
  patientId: string;
}) {
  const download = useMutation({
    mutationFn: async () => await handleDownload({ report, patientId }),
    onSuccess: () => toast.success("Report downloaded successfully."),
    onError: () => toast.error("Could not download report."),
  });

  return { ...download };
}
