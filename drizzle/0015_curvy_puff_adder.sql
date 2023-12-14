ALTER TABLE "verificationToken" DROP CONSTRAINT "verificationToken_identifier_token";--> statement-breakpoint
ALTER TABLE "procedure_pricing" ADD COLUMN "created" timestamp;--> statement-breakpoint
ALTER TABLE "verificationToken" ADD CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token");