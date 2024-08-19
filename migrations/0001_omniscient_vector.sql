ALTER TABLE "basic_profiles" ALTER COLUMN "username" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "basic_profiles" DROP COLUMN IF EXISTS "password";