ALTER TABLE "external_healthcare_provider" ALTER COLUMN "isActive" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "doctor" ALTER COLUMN "is_active" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "healthcare_provider_doctors" ADD COLUMN "created_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "patientConditions" ADD COLUMN "created" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "patientConditions" ADD COLUMN "assignedBy" text NOT NULL;--> statement-breakpoint
ALTER TABLE "patientConditions" ADD COLUMN "removed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "patientConditions" ADD COLUMN "removedAt" timestamp;--> statement-breakpoint
ALTER TABLE "patientConditions" ADD COLUMN "removedBy" text;--> statement-breakpoint
ALTER TABLE "patient_procedures" ADD COLUMN "note" text;--> statement-breakpoint
ALTER TABLE "patient_procedures" ADD COLUMN "createdAt" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "patient_procedures" ADD COLUMN "createdBy" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "healthcare_provider_doctors" ADD CONSTRAINT "healthcare_provider_doctors_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patientConditions" ADD CONSTRAINT "patientConditions_assignedBy_user_id_fk" FOREIGN KEY ("assignedBy") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patientConditions" ADD CONSTRAINT "patientConditions_removedBy_user_id_fk" FOREIGN KEY ("removedBy") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_procedures" ADD CONSTRAINT "patient_procedures_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
