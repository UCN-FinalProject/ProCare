"use client";
import useReportDownload from "~/hooks/useReportDownload";
import Button from "~/components/Button";
import type { ReportFile } from "~/hooks/useReportDownload";
import { DownloadIcon } from "lucide-react";

export default function DownloadButton({
  report,
}: Readonly<{ report: ReportFile }>) {
  const download = useReportDownload(report);

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
