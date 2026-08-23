ALTER TABLE "users" DROP CONSTRAINT "user_staus_check";--> statement-breakpoint
ALTER TABLE "credentials" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now();