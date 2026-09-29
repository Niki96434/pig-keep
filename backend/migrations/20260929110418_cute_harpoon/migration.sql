CREATE TABLE "noteTags" (
	"note_id" uuid,
	"tag_id" uuid,
	CONSTRAINT "noteTags_pkey" PRIMARY KEY("tag_id","note_id")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "isArchive" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "isDeleted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "noteTags" ADD CONSTRAINT "noteTags_note_id_notes_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id");--> statement-breakpoint
ALTER TABLE "noteTags" ADD CONSTRAINT "noteTags_tag_id_tags_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id");