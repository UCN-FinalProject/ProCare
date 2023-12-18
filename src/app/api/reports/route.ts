import { type NextRequest, NextResponse } from "next/server";
import ReportService from "~/server/service/ReportService";

export const reportFiles = [
  "ProcedureReport",
  "TreatmentEndReport",
  "TreatmentLog",
  "TreatmentPlan",
  "TreatmentProposal",
] as const;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const document = searchParams.get("document");

  if (
    !document ||
    !reportFiles.includes(document as (typeof reportFiles)[number])
  ) {
    return NextResponse.json(
      { message: "Invalid document type." },
      { status: 404 },
    );
  }

  try {
    return await ReportService.generateReport(
      document as (typeof reportFiles)[number],
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Could not generate a report." },
      { status: 500 },
    );
  }
}
