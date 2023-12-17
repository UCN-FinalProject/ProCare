"use client";
import useReportDownload from "~/hooks/useReportDownload";
import Button from "~/components/Button";

export function Download() {
  const ProcedureReport = useReportDownload("ProcedureReport");
  const TreatmentEndReport = useReportDownload("TreatmentEndReport");
  const TreatmentLog = useReportDownload("TreatmentLog");
  const TreatmentPlan = useReportDownload("TreatmentPlan");
  const TreatmentProposal = useReportDownload("TreatmentProposal");

  return (
    <div className="flex flex-col gap-y-2 max-w-[200px]">
      <Button
        onClick={() => ProcedureReport.mutate()}
        isLoading={ProcedureReport.isLoading}
      >
        Procedure Report
      </Button>
      <Button
        onClick={() => TreatmentEndReport.mutate()}
        isLoading={TreatmentEndReport.isLoading}
      >
        Treatment End Report
      </Button>
      <Button
        onClick={() => TreatmentLog.mutate()}
        isLoading={TreatmentLog.isLoading}
      >
        Treatment Log
      </Button>
      <Button
        onClick={() => TreatmentPlan.mutate()}
        isLoading={TreatmentPlan.isLoading}
      >
        Treatment Plan
      </Button>
      <Button
        onClick={() => TreatmentProposal.mutate()}
        isLoading={TreatmentProposal.isLoading}
      >
        Treatment Proposal
      </Button>
    </div>
  );
}
