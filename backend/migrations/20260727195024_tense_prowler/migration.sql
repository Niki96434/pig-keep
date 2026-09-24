CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"user_id" uuid DEFAULT uuidv7() NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"content" text DEFAULT '' NOT NULL
);
