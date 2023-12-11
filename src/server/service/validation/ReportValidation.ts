export type Report =
  | {
      type: "treatment_end_report";
      url: "https://uploadthing.com/f/70795389-807c-4f90-9127-5b514e6ce75c-1nr0sq.docx";
    }
  | {
      type: "treatment_log";
      url: "https://uploadthing.com/f/04b2085b-5d4f-4464-9410-a1b5ea6df352-k7sk3k.docx";
    }
  | {
      type: "treatment_proposal";
      url: "https://uploadthing.com/f/e5695737-11b8-4b0b-88c0-712e99f1c4cb-sswar2.docx";
    }
  | {
      type: "procedure_report";
      url: "https://uploadthing.com/f/799f6ff4-c448-4bb3-9cac-7e6f2445a6e3-cd7dnr.docx";
    }
  | {
      type: "treatment_plan";
      url: "https://uploadthing.com/f/686a06d6-973b-4aaf-9875-116ee8ac8893-u51teb.docx";
    };
