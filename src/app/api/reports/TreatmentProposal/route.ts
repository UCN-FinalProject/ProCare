import { parseErrorMessage } from "~/lib/parseError";
import ReportService from "~/server/service/ReportService";

export async function GET() {
  try {
    return await ReportService.generateReport({
      type: "treatment_proposal",
      url: "https://uploadthing.com/f/e5695737-11b8-4b0b-88c0-712e99f1c4cb-sswar2.docx",
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
