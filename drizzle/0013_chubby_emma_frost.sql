DO $$ BEGIN
 CREATE TYPE "biological_sex" AS ENUM('male', 'female');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "disability" AS ENUM('limited_physical', 'physical', 'mental', 'none');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patient" (
	"id" text PRIMARY KEY NOT NULL,
	"full_name" varchar NOT NULL,
	"is_active" boolean NOT NULL,
	"biological_sex" "biological_sex" NOT NULL,
	"date_of_birth" timestamp NOT NULL,
	"ssn" varchar NOT NULL,
	"start_date" timestamp NOT NULL,
	"expected_end_of_treatment" timestamp NOT NULL,
	"end_date" timestamp,
	"insured_id" varchar NOT NULL,
	"email" varchar,
	"phone" varchar,
	"disability" "disability" NOT NULL,
	"alergies" varchar,
	"note" varchar,
	CONSTRAINT "patient_ssn_unique" UNIQUE("ssn"),
	CONSTRAINT "patient_insured_id_unique" UNIQUE("insured_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patient_address" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" text NOT NULL,
	"address1" varchar NOT NULL,
	"address2" varchar,
	"city" varchar NOT NULL,
	"zip_code" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patient_healthcare_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" text NOT NULL,
	"health_insurance_id" integer NOT NULL,
	"doctor_id" integer NOT NULL,
	"healthcare_provider_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patientConditions" (
	"id" serial PRIMARY KEY NOT NULL,
	"patientID" text NOT NULL,
	"conditionID" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_address" ADD CONSTRAINT "patient_address_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_healthcare_info" ADD CONSTRAINT "patient_healthcare_info_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_healthcare_info" ADD CONSTRAINT "patient_healthcare_info_health_insurance_id_health_insurance_id_fk" FOREIGN KEY ("health_insurance_id") REFERENCES "health_insurance"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_healthcare_info" ADD CONSTRAINT "patient_healthcare_info_doctor_id_doctor_ID_fk" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_healthcare_info" ADD CONSTRAINT "patient_healthcare_info_healthcare_provider_id_external_healthcare_provider_ID_fk" FOREIGN KEY ("healthcare_provider_id") REFERENCES "external_healthcare_provider"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patientConditions" ADD CONSTRAINT "patientConditions_patientID_patient_id_fk" FOREIGN KEY ("patientID") REFERENCES "patient"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patientConditions" ADD CONSTRAINT "patientConditions_conditionID_health_condition_ID_fk" FOREIGN KEY ("conditionID") REFERENCES "health_condition"("ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
