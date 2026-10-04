DROP INDEX "action_logs_unprocessed_idx";--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "pleasure_index" integer DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE "action_logs" DROP COLUMN "processed_at";--> statement-breakpoint
ALTER TABLE "action_types" ALTER COLUMN "name" SET DATA TYPE varchar(100) USING "name"::varchar(100);--> statement-breakpoint
CREATE INDEX "idx_action_logs_cron_covering" ON "action_logs" ("created_at","pet_id","action_type_id");