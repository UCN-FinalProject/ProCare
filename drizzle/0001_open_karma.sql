CREATE TABLE IF NOT EXISTS "head_doctor" (
	"id" serial PRIMARY KEY NOT NULL,
	"tennant_id" integer NOT NULL,
	"head_doctor" varchar NOT NULL,
	"head_doctor_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_care_provider" (
	"id" serial PRIMARY KEY NOT NULL,
	"tennant_id" integer NOT NULL,
	"name" varchar NOT NULL,
	"address1" varchar NOT NULL,
	"address2" varchar,
	"city" varchar NOT NULL,
	"zip" varchar NOT NULL
);
--> statement-breakpoint
DROP TABLE "doctor";--> statement-breakpoint
ALTER TABLE "tennant" DROP CONSTRAINT "tennant_doctor_id_doctor_id_fk";
--> statement-breakpoint
ALTER TABLE "tennant" DROP COLUMN IF EXISTS "pzs_name";--> statement-breakpoint
ALTER TABLE "tennant" DROP COLUMN IF EXISTS "pzs_id";--> statement-breakpoint
ALTER TABLE "tennant" DROP COLUMN IF EXISTS "doctor_id";--> statement-breakpoint
ALTER TABLE "tennant" DROP COLUMN IF EXISTS "pzs_address1";--> statement-breakpoint
ALTER TABLE "tennant" DROP COLUMN IF EXISTS "pzs_address2";--> statement-breakpoint
ALTER TABLE "tennant" DROP COLUMN IF EXISTS "pzs_city";--> statement-breakpoint
ALTER TABLE "tennant" DROP COLUMN IF EXISTS "pzs_zip";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "head_doctor" ADD CONSTRAINT "head_doctor_tennant_id_tennant_id_fk" FOREIGN KEY ("tennant_id") REFERENCES "tennant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_care_provider" ADD CONSTRAINT "health_care_provider_tennant_id_tennant_id_fk" FOREIGN KEY ("tennant_id") REFERENCES "tennant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
