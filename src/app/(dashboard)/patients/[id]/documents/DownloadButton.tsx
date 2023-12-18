"use client";
import useReportDownload from "~/hooks/useReportDownload";
import Button from "~/components/Button";
import type { ReportFile } from "~/hooks/useReportDownload";
import { DownloadIcon } from "lucide-react";

export default function DownloadButton({
  report,
  patientId,
}: Readonly<{ report: ReportFile; patientId: string }>) {
  const download = useReportDownload({
    report,
    patientId,
  });

  return (
    <Button
      onClick={() => download.mutate()}
      isLoading={download.isLoading}
      size="sm"
      className="flex items-center gap-1"
    >
      Download
      <DownloadIcon className="w-4 h-4" />
    </Button>
  );
}
