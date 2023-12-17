import { parseErrorMessage } from "~/lib/parseError";
import ReportService from "~/server/service/ReportService";

export async function GET() {
  try {
    return await ReportService.generateReport({
      type: "treatment_log",
      url: "https://uploadthing.com/f/04b2085b-5d4f-4464-9410-a1b5ea6df352-k7sk3k.docx",
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
