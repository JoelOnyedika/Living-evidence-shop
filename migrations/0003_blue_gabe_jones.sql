CREATE TABLE IF NOT EXISTS "dashboard" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"total_sales" integer DEFAULT 0,
	"active_listings" integer DEFAULT 0,
	"pending_orders" integer DEFAULT 0,
	"review" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ecommerce_products" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"price" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"image" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_postings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"description" text NOT NULL,
	"salary" integer NOT NULL,
	"location" text NOT NULL,
	"title" text NOT NULL,
	"job_type" text NOT NULL,
	"image" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "real_estate_listings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"location" text NOT NULL,
	"title" text NOT NULL,
	"property_type" text NOT NULL,
	"image" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"star" integer NOT NULL,
	"reviewer" uuid NOT NULL,
	"product_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dashboard" ADD CONSTRAINT "dashboard_user_id_basic_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "basic_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dashboard" ADD CONSTRAINT "dashboard_review_reviews_id_fk" FOREIGN KEY ("review") REFERENCES "reviews"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ecommerce_products" ADD CONSTRAINT "ecommerce_products_user_id_basic_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "basic_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_user_id_basic_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "basic_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "real_estate_listings" ADD CONSTRAINT "real_estate_listings_user_id_basic_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "basic_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_basic_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "basic_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_basic_profiles_id_fk" FOREIGN KEY ("reviewer") REFERENCES "basic_profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
