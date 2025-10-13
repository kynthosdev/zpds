CREATE TABLE "evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idea_id" uuid NOT NULL,
	"evaluator_id" uuid NOT NULL,
	"impact_score" integer,
	"feasibility_score" integer,
	"resource_score" integer,
	"strategic_score" integer,
	"comments" text,
	"recommendation" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_idea_id_ideas_id_fk" FOREIGN KEY ("idea_id") REFERENCES "public"."ideas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_evaluator_id_users_id_fk" FOREIGN KEY ("evaluator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;