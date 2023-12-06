CREATE TABLE IF NOT EXISTS "procedure_pricing" (
	"ID" serial PRIMARY KEY NOT NULL,
	"procedure_id" integer NOT NULL,
	"health_insurance_id" integer NOT NULL,
	"credits" integer NOT NULL,
	"price" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "procedures" (
	"ID" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patient_procedures" (
	"id" serial PRIMARY KEY NOT NULL,
	"patientID" text NOT NULL,
	"procedureID" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "procedure_pricing" ADD CONSTRAINT "procedure_pricing_procedure_id_procedures_ID_fk" FOREIGN KEY ("procedure_id") REFERENCES "procedures"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "procedure_pricing" ADD CONSTRAINT "procedure_pricing_health_insurance_id_health_insurance_id_fk" FOREIGN KEY ("health_insurance_id") REFERENCES "health_insurance"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_procedures" ADD CONSTRAINT "patient_procedures_patientID_patient_id_fk" FOREIGN KEY ("patientID") REFERENCES "patient"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_procedures" ADD CONSTRAINT "patient_procedures_procedureID_procedures_ID_fk" FOREIGN KEY ("procedureID") REFERENCES "procedures"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
