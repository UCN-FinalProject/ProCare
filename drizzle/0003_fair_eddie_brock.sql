CREATE TABLE IF NOT EXISTS "health_insurance" (
	"id" serial PRIMARY KEY NOT NULL,
	"insurance_id" integer NOT NULL,
	"registered_id" integer NOT NULL,
	"name" varchar NOT NULL,
	"price_per_credit" numeric NOT NULL,
	CONSTRAINT "health_insurance_insurance_id_unique" UNIQUE("insurance_id"),
	CONSTRAINT "health_insurance_registered_id_unique" UNIQUE("registered_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_insurance_address" (
	"id" serial PRIMARY KEY NOT NULL,
	"insurance_id" integer NOT NULL,
	"address1" varchar NOT NULL,
	"address2" varchar,
	"city" varchar NOT NULL,
	"zip" varchar NOT NULL,
	"phone_number" varchar,
	"email" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_insurance_vat" (
	"id" serial PRIMARY KEY NOT NULL,
	"insurance_id" integer NOT NULL,
	"vat1" varchar NOT NULL,
	"vat2" varchar NOT NULL,
	"vat3" varchar
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_insurance_address" ADD CONSTRAINT "health_insurance_address_insurance_id_health_insurance_id_fk" FOREIGN KEY ("insurance_id") REFERENCES "health_insurance"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_insurance_vat" ADD CONSTRAINT "health_insurance_vat_insurance_id_health_insurance_id_fk" FOREIGN KEY ("insurance_id") REFERENCES "health_insurance"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
