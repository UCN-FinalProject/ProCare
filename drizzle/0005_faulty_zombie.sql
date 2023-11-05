CREATE TABLE IF NOT EXISTS "external_healthcare_provider" (
	"ID" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"vat" varchar NOT NULL,
	"address1" varchar NOT NULL,
	"address2" varchar,
	"city" varchar NOT NULL,
	"zip" integer NOT NULL,
	"date_from" date,
	"date_until" date,
	"note" varchar,
	"isActive" boolean DEFAULT true
);
