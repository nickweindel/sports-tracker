CREATE TABLE IF NOT EXISTS "public"."arena_override" (
    "game_id" integer NOT NULL,
    "league" "text" NOT NULL,
    "arena" text NOT NULL,
    "neutral_site" boolean NOT NULL
);


ALTER TABLE "public"."arena_override" OWNER TO "postgres";