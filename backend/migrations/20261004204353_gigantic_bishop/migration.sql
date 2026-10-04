CREATE TABLE "action_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"pet_id" uuid NOT NULL,
	"action_type_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "action_types" (
	"id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL UNIQUE,
	"weight" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "level_requirements" (
	"level" integer PRIMARY KEY,
	"required_xp" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX "action_logs_pet_id_idx" ON "action_logs" ("pet_id");--> statement-breakpoint
CREATE INDEX "action_logs_created_at_idx" ON "action_logs" ("created_at");--> statement-breakpoint
CREATE INDEX "action_logs_unprocessed_idx" ON "action_logs" ("created_at") WHERE "processed_at" IS NULL;--> statement-breakpoint
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_pet_id_pets_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_action_type_id_action_types_id_fkey" FOREIGN KEY ("action_type_id") REFERENCES "action_types"("id") ON DELETE RESTRICT;