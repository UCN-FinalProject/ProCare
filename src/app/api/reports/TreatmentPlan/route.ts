import { parseErrorMessage } from "~/lib/parseError";
import ReportService from "~/server/service/ReportService";

export async function GET() {
  try {
    return await ReportService.generateReport({
      type: "treatment_plan",
      url: "https://uploadthing.com/f/686a06d6-973b-4aaf-9875-116ee8ac8893-u51teb.docx",
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
