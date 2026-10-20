ALTER TABLE "noteTags" RENAME TO "note_tags";--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "createdAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "updatedAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "isArchive" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "isDeleted" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "search_index" ON "notes" USING gin (to_tsvector('russian', coalesce("title", '') || ' ' || coalesce("content")));
