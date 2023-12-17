import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { parseErrorMessage } from "~/lib/parseError";
import type { Report } from "~/server/service/validation/ReportValidation";

export default {
  async generateReport(report: Report) {
    // use fetch to get a response
    const response = await fetch(report.url).catch((e: unknown) => {
      throw new Error(
        parseErrorMessage({
          defaultMessage: "Error fetching the file",
          error: e,
        }),
      );
    });

    // Get the response as an arrayBuffer
    const fileBuffer = await response.arrayBuffer();
    // Unzip the content of the file
    const zip = new PizZip(fileBuffer);
    // This will parse the template, and will throw an error if the template is invalid
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
    doc.render({
      first_name: "John",
      last_name: "Doe",
      ssn: "123456789",
      insurance: "24 - Dôvera",
      address: "Nižná trieda 24, Kosice, Slovakia",
    });

    // Get the zip document and generate it as a nodebuffer
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: "DEFLATE",
    });

    // return a new response but use 'content-disposition' to suggest saving the file to the user's computer
    return new Response(new Uint8Array(buf), {
      headers: {
        ...response.headers, // copy the previous headers
        "content-disposition": `attachment; filename="${report.type}.docx"`,
      },
    });
  },
} as const;
