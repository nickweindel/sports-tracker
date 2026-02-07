-- Add notes field to games table
ALTER TABLE "public"."games" ADD COLUMN "notes" text;

-- Add notes field to games view
CREATE OR REPLACE VIEW "public"."vw_games" AS
 SELECT "g"."user_email",
    "g"."game_id",
    "g"."league",
    "g"."game_date",
    COALESCE("oh"."team_abbreviation_override", "g"."home_team") AS "home_team",
    "g"."home_team_name",
    "g"."home_team_score",
    COALESCE("oh"."team_logo", "g"."home_team_logo") AS "home_team_logo",
    COALESCE("rk"."home_team_rank", "g"."home_team_rank") AS "home_team_rank",
    COALESCE("oa"."team_abbreviation_override", "g"."away_team") AS "away_team",
    "g"."away_team_name",
    "g"."away_team_score",
    COALESCE("oa"."team_logo", "g"."away_team_logo") AS "away_team_logo",
    COALESCE("rk"."away_team_rank", "g"."away_team_rank") AS "away_team_rank",
    "g"."game_center_link",
    "g"."arena",
    "g"."arena_city",
    "g"."arena_state",
    "g"."arena_country",
    "g"."neutral_site",
    "g"."notes"
   FROM ((("public"."games" "g"
     LEFT JOIN "public"."team_override" "oh" ON ((("g"."league" = "oh"."league") AND ("g"."home_team" = "oh"."team_abbreviation"))))
     LEFT JOIN "public"."team_override" "oa" ON ((("g"."league" = "oa"."league") AND ("g"."away_team" = "oa"."team_abbreviation"))))
     LEFT JOIN "public"."rank_override" "rk" ON ((("g"."game_id" = "rk"."game_id") AND ("g"."league" = "rk"."league"))));
