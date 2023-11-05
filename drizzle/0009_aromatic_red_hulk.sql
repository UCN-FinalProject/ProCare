CREATE TABLE IF NOT EXISTS "healthcare_provider_doctors" (
	"ID" serial PRIMARY KEY NOT NULL,
	"healthcare_provider_id" integer NOT NULL,
	"doctor_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "doctor" (
	"ID" serial PRIMARY KEY NOT NULL,
	"full_name" varchar NOT NULL,
	"doctor_id" varchar NOT NULL,
	"note" varchar,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
ALTER TABLE "external_healthcare_provider" DROP COLUMN IF EXISTS "date_from";--> statement-breakpoint
ALTER TABLE "external_healthcare_provider" DROP COLUMN IF EXISTS "date_until";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "healthcare_provider_doctors" ADD CONSTRAINT "healthcare_provider_doctors_healthcare_provider_id_external_healthcare_provider_ID_fk" FOREIGN KEY ("healthcare_provider_id") REFERENCES "external_healthcare_provider"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "healthcare_provider_doctors" ADD CONSTRAINT "healthcare_provider_doctors_doctor_id_doctor_ID_fk" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
