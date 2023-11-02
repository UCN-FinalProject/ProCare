CREATE TABLE IF NOT EXISTS "doctor" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tennant" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"basis" numeric NOT NULL,
	"pzs_name" varchar NOT NULL,
	"regional_authority" varchar NOT NULL,
	"pzs_id" integer NOT NULL,
	"doctor_id" integer NOT NULL,
	"pzs_address1" varchar NOT NULL,
	"pzs_address2" varchar,
	"pzs_city" varchar NOT NULL,
	"pzs_zip" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tennant_bank_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"tennant_id" integer NOT NULL,
	"bank_name" varchar NOT NULL,
	"bank_account_id" varchar NOT NULL,
	"iban" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tennant_vat" (
	"id" serial PRIMARY KEY NOT NULL,
	"tennant_id" integer NOT NULL,
	"vat1" varchar NOT NULL,
	"vat2" varchar NOT NULL,
	"vat3" varchar
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tennant" ADD CONSTRAINT "tennant_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tennant_bank_details" ADD CONSTRAINT "tennant_bank_details_tennant_id_tennant_id_fk" FOREIGN KEY ("tennant_id") REFERENCES "tennant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tennant_vat" ADD CONSTRAINT "tennant_vat_tennant_id_tennant_id_fk" FOREIGN KEY ("tennant_id") REFERENCES "tennant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
