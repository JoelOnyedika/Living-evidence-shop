ALTER TABLE "ecommerce_products" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ecommerce_products" ADD COLUMN "brand" text;--> statement-breakpoint
ALTER TABLE "ecommerce_products" ADD COLUMN "model" text;--> statement-breakpoint
ALTER TABLE "ecommerce_products" ADD COLUMN "condition" text;--> statement-breakpoint
ALTER TABLE "job_postings" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "real_estate_listings" ADD COLUMN "type" text NOT NULL;