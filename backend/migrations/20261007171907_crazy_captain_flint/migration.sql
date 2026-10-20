ALTER TABLE "action_logs" DROP CONSTRAINT "action_logs_pet_id_pets_id_fkey";--> statement-breakpoint
ALTER TABLE "action_logs" DROP CONSTRAINT "action_logs_action_type_id_action_types_id_fkey";--> statement-breakpoint
DROP TABLE "action_logs";--> statement-breakpoint
DROP TABLE "action_types";--> statement-breakpoint
DROP TABLE "level_requirements";--> statement-breakpoint
DROP TABLE "pets";