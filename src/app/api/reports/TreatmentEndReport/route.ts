import { parseErrorMessage } from "~/lib/parseError";
import ReportService from "~/server/service/ReportService";

export async function GET() {
  try {
    return await ReportService.generateReport({
      type: "treatment_end_report",
      url: "https://uploadthing.com/f/70795389-807c-4f90-9127-5b514e6ce75c-1nr0sq.docx",
    });
  } catch (e) {
    return {
      status: 500,
      body: {
        error: parseErrorMessage({
          defaultMessage: "Could not generate a report.",
          error: e,
        }),
      },
    };
  }
}
