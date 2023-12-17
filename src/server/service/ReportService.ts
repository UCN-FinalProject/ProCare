import Docxtemplater from "docxtemplater";
import { NextResponse } from "next/server";
import PizZip from "pizzip";
import { parseErrorMessage } from "~/lib/parseError";

export default {
  async generateReport(reportType: (typeof reports)[number]["document"]) {
    // Find the report by the document name
    const report = reports.find((r) => r.document === reportType)!;
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
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        ...response.headers, // copy the previous headers
        "content-disposition": `attachment; filename="${report.document}.docx"`,
      },
    });
  },
} as const;

const reports = [
  {
    document: "ProcedureReport",
    url: "https://uploadthing.com/f/799f6ff4-c448-4bb3-9cac-7e6f2445a6e3-cd7dnr.docx",
  },
  {
    document: "TreatmentPlan",
    url: "https://uploadthing.com/f/686a06d6-973b-4aaf-9875-116ee8ac8893-u51teb.docx",
  },
  {
    document: "TreatmentProposal",
    url: "https://uploadthing.com/f/e5695737-11b8-4b0b-88c0-712e99f1c4cb-sswar2.docx",
  },
  {
    document: "TreatmentLog",
    url: "https://uploadthing.com/f/04b2085b-5d4f-4464-9410-a1b5ea6df352-k7sk3k.docx",
  },
  {
    document: "TreatmentEndReport",
    url: "https://uploadthing.com/f/70795389-807c-4f90-9127-5b514e6ce75c-1nr0sq.docx",
  },
] as const;
