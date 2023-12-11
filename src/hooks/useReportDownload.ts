"use client";
import { useMutation } from "@tanstack/react-query";

type ReportFile =
  | "ProcedureReport"
  | "TreatmentEndReport"
  | "TreatmentLog"
  | "TreatmentPlan"
  | "TreatmentProposal";

async function handleDownload(report: ReportFile) {
  // Trigger the API endpoint to download the file
  const response = await fetch(`api/reports/${report}`);
  const data = await response.blob();

  // Create a Blob URL and initiate the download
  const url = window.URL.createObjectURL(data);
  // Create a link element to trigger the download
  const a = document.createElement("a");
  // Set the href and download attributes for the anchor element
  a.href = url;
  a.download = `${report}.docx`;
  document.body.appendChild(a);
  a.click();
  // Remove the anchor element from the DOM
  document.body.removeChild(a);
}

export default function useReportDownload(report: ReportFile) {
  const download = useMutation(async () => await handleDownload(report));

  return { ...download };
}
