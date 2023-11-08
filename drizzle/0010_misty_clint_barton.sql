CREATE TABLE IF NOT EXISTS "credential" (
	"id" text PRIMARY KEY NOT NULL,
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"credentialPublicKey" json NOT NULL,
	"counter" integer NOT NULL,
	"transports" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT verificationToken_identifier_token PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cred_userId_idx" ON "credential" ("userId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credential" ADD CONSTRAINT "credential_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
