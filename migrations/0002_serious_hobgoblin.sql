ALTER TABLE "basic_profiles" ADD COLUMN "kyc_status" text DEFAULT 'no';--> statement-breakpoint
ALTER TABLE "detailed_profiles" ADD COLUMN "first_name" text;--> statement-breakpoint
ALTER TABLE "detailed_profiles" ADD COLUMN "last_name" text;--> statement-breakpoint
ALTER TABLE "detailed_profiles" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "detailed_profiles" ADD COLUMN "phone_number" text;--> statement-breakpoint
ALTER TABLE "detailed_profiles" ADD COLUMN "nationality" text;--> statement-breakpoint
ALTER TABLE "detailed_profiles" ADD COLUMN "preferred_contact" text;--> statement-breakpoint
ALTER TABLE "detailed_profiles" ADD COLUMN "assets" integer;--> statement-breakpoint
ALTER TABLE "detailed_profiles" ADD COLUMN "liabilities" integer;--> statement-breakpoint
ALTER TABLE "detailed_profiles" DROP COLUMN IF EXISTS "full_name";--> statement-breakpoint
ALTER TABLE "detailed_profiles" DROP COLUMN IF EXISTS "phone";--> statement-breakpoint
ALTER TABLE "detailed_profiles" DROP COLUMN IF EXISTS "contact_method";--> statement-breakpoint
ALTER TABLE "detailed_profiles" ADD CONSTRAINT "detailed_profiles_email_unique" UNIQUE("email");