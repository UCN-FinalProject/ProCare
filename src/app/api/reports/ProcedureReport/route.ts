import { parseErrorMessage } from "~/lib/parseError";
import ReportService from "~/server/service/ReportService";

export async function GET() {
  try {
    return await ReportService.generateReport({
      type: "procedure_report",
      url: "https://uploadthing.com/f/799f6ff4-c448-4bb3-9cac-7e6f2445a6e3-cd7dnr.docx",
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
