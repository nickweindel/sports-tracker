


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."arenas"("team" "text" DEFAULT NULL::"text") RETURNS TABLE("user_email" "text", "league" "text", "arena" "text", "visits" bigint)
    LANGUAGE "sql"
    AS $$
  SELECT
    user_email,
    league,
    arena,
    COUNT(*) AS visits
  FROM games
  WHERE
    team IS NULL
    OR home_team = team
    OR away_team = team
  GROUP BY
    user_email,
    league,
    arena;
$$;


ALTER FUNCTION "public"."arenas"("team" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."teams"("arena" "text" DEFAULT NULL::"text") RETURNS TABLE("user_email" "text", "league" "text", "team" "text", "team_logo" "text", "home_wins" bigint, "home_losses" bigint, "home_ties" bigint, "away_wins" bigint, "away_losses" bigint, "away_ties" bigint, "neutral_wins" bigint, "neutral_losses" bigint, "neutral_ties" bigint, "overall_wins" bigint, "overall_losses" bigint, "overall_ties" bigint)
    LANGUAGE "sql"
    AS $_$with
  cte_games AS (
      SELECT *
  FROM games g
  WHERE $1 IS NULL OR g.arena = $1
  )

,cte_home_record as (
    select
      games.user_email,
      games.league,
      games.home_team as team,
      games.home_team_logo as team_logo,
      sum(
        case
          when games.home_team_score > games.away_team_score then 1
          else 0
        end
      ) as home_team_wins,
      sum(
        case
          when games.home_team_score < games.away_team_score then 1
          else 0
        end
      ) as home_team_losses,
      sum(
        case
          when games.home_team_score = games.away_team_score then 1
          else 0
        end
      ) as home_team_ties
    from
      cte_games games
    where
      games.neutral_site = false
    group by
      games.user_email,
      games.league,
      games.home_team,
      games.home_team_logo
  ),
  cte_away_record as (
    select
      games.user_email,
      games.league,
      games.away_team as team,
      games.away_team_logo as team_logo,
      sum(
        case
          when games.away_team_score > games.home_team_score then 1
          else 0
        end
      ) as away_team_wins,
      sum(
        case
          when games.away_team_score < games.home_team_score then 1
          else 0
        end
      ) as away_team_losses,
      sum(
        case
          when games.away_team_score = games.home_team_score then 1
          else 0
        end
      ) as away_team_ties
    from
      cte_games games
    where
      games.neutral_site = false
    group by
      games.user_email,
      games.league,
      games.away_team,
      games.away_team_logo
  ),
  cte_neutral_home_record as (
    select
      games.user_email,
      games.league,
      games.home_team as team,
      games.home_team_logo as team_logo,
      sum(
        case
          when games.home_team_score > games.away_team_score then 1
          else 0
        end
      ) as home_team_wins,
      sum(
        case
          when games.home_team_score < games.away_team_score then 1
          else 0
        end
      ) as home_team_losses,
      sum(
        case
          when games.home_team_score = games.away_team_score then 1
          else 0
        end
      ) as home_team_ties
    from
      cte_games games
    where
      games.neutral_site = true
    group by
      games.user_email,
      games.league,
      games.home_team,
      games.home_team_logo
  ),
  cte_neutral_away_record as (
    select
      games.user_email,
      games.league,
      games.away_team as team,
      games.away_team_logo as team_logo,
      sum(
        case
          when games.away_team_score > games.home_team_score then 1
          else 0
        end
      ) as away_team_wins,
      sum(
        case
          when games.away_team_score < games.home_team_score then 1
          else 0
        end
      ) as away_team_losses,
      sum(
        case
          when games.away_team_score = games.home_team_score then 1
          else 0
        end
      ) as away_team_ties
    from
      cte_games games
    where
      games.neutral_site = true
    group by
      games.user_email,
      games.league,
      games.away_team,
      games.away_team_logo
  ),
  cte_full_records as (
    select
      COALESCE(
        home.user_email,
        away.user_email,
        nhome.user_email,
        naway.user_email
      ) as user_email,
      COALESCE(
        home.league,
        away.league,
        nhome.league,
        naway.league
      ) as league,
      COALESCE(home.team, away.team, nhome.team, naway.team) as team,
      COALESCE(
        home.team_logo,
        away.team_logo,
        nhome.team_logo,
        naway.team_logo
      ) as team_logo,
      sum(COALESCE(home.home_team_wins, 0::bigint)) as home_wins,
      sum(COALESCE(home.home_team_losses, 0::bigint)) as home_losses,
      sum(COALESCE(home.home_team_ties, 0::bigint)) as home_ties,
      sum(COALESCE(away.away_team_wins, 0::bigint)) as away_wins,
      sum(COALESCE(away.away_team_losses, 0::bigint)) as away_losses,
      sum(COALESCE(away.away_team_ties, 0::bigint)) as away_ties,
      sum(
        COALESCE(nhome.home_team_wins, 0::bigint) + COALESCE(naway.away_team_wins, 0::bigint)
      ) as neutral_wins,
      sum(
        COALESCE(nhome.home_team_losses, 0::bigint) + COALESCE(naway.away_team_losses, 0::bigint)
      ) as neutral_losses,
      sum(
        COALESCE(nhome.home_team_ties, 0::bigint) + COALESCE(naway.away_team_ties, 0::bigint)
      ) as neutral_ties,
      sum(
        COALESCE(home.home_team_wins, 0::bigint) + COALESCE(away.away_team_wins, 0::bigint) + COALESCE(nhome.home_team_wins, 0::bigint) + COALESCE(naway.away_team_wins, 0::bigint)
      ) as overall_wins,
      sum(
        COALESCE(home.home_team_losses, 0::bigint) + COALESCE(away.away_team_losses, 0::bigint) + COALESCE(nhome.home_team_losses, 0::bigint) + COALESCE(naway.away_team_losses, 0::bigint)
      ) as overall_losses,
      sum(
        COALESCE(home.home_team_ties, 0::bigint) + COALESCE(away.away_team_ties, 0::bigint) + COALESCE(nhome.home_team_ties, 0::bigint) + COALESCE(naway.away_team_ties, 0::bigint)
      ) as overall_ties
    from
      cte_home_record home
      full join cte_away_record away on home.team = away.team
      and home.league = away.league
      and home.user_email = away.user_email
      full join cte_neutral_home_record nhome on home.team = nhome.team
      and home.league = nhome.league
      and home.user_email = nhome.user_email
      full join cte_neutral_away_record naway on home.team = naway.team
      and home.league = naway.league
      and home.user_email = naway.user_email
    group by
      (
        COALESCE(
          home.user_email,
          away.user_email,
          nhome.user_email,
          naway.user_email
        )
      ),
      (
        COALESCE(
          home.league,
          away.league,
          nhome.league,
          naway.league
        )
      ),
      (
        COALESCE(home.team, away.team, nhome.team, naway.team)
      ),
      (
        COALESCE(
          home.team_logo,
          away.team_logo,
          nhome.team_logo,
          naway.team_logo
        )
      )
  )
select
  r.user_email,
  r.league,
  COALESCE(o.team_abbreviation_override, r.team) as team,
  COALESCE(o.team_logo, r.team_logo) as team_logo,
  sum(r.home_wins) as home_wins,
  sum(r.home_losses) as home_losses,
  sum(r.home_ties) as home_ties,
  sum(r.away_wins) as away_wins,
  sum(r.away_losses) as away_losses,
  sum(r.away_ties) as away_ties,
  sum(r.neutral_wins) as neutral_wins,
  sum(r.neutral_losses) as neutral_losses,
  sum(r.neutral_ties) as neutral_ties,
  sum(r.overall_wins) as overall_wins,
  sum(r.overall_losses) as overall_losses,
  sum(r.overall_ties) as overall_ties
from
  cte_full_records r
  left join team_override o on r.league = o.league
  and r.team = o.team_abbreviation
group by
  r.user_email,
  r.league,
  (COALESCE(o.team_abbreviation_override, r.team)),
  (COALESCE(o.team_logo, r.team_logo))$_$;


ALTER FUNCTION "public"."teams"("arena" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."games" (
    "user_email" "text" NOT NULL,
    "game_id" integer NOT NULL,
    "league" "text" NOT NULL,
    "game_date" "date" NOT NULL,
    "home_team" "text" NOT NULL,
    "home_team_name" "text" NOT NULL,
    "home_team_score" integer NOT NULL,
    "home_team_logo" "text" NOT NULL,
    "home_team_rank" integer,
    "away_team" "text" NOT NULL,
    "away_team_name" "text" NOT NULL,
    "away_team_score" integer NOT NULL,
    "away_team_logo" "text" NOT NULL,
    "away_team_rank" integer,
    "game_center_link" "text",
    "arena" "text" NOT NULL,
    "arena_city" "text",
    "arena_state" "text",
    "arena_country" "text",
    "neutral_site" boolean
);


ALTER TABLE "public"."games" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rank_override" (
    "game_id" integer NOT NULL,
    "league" "text" NOT NULL,
    "home_team_rank" integer,
    "away_team_rank" integer
);


ALTER TABLE "public"."rank_override" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."team_override" (
    "league" "text" NOT NULL,
    "team_abbreviation" "text" NOT NULL,
    "team_abbreviation_override" "text",
    "team_logo" "text"
);


ALTER TABLE "public"."team_override" OWNER TO "postgres";


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
    "g"."neutral_site"
   FROM ((("public"."games" "g"
     LEFT JOIN "public"."team_override" "oh" ON ((("g"."league" = "oh"."league") AND ("g"."home_team" = "oh"."team_abbreviation"))))
     LEFT JOIN "public"."team_override" "oa" ON ((("g"."league" = "oa"."league") AND ("g"."away_team" = "oa"."team_abbreviation"))))
     LEFT JOIN "public"."rank_override" "rk" ON ((("g"."game_id" = "rk"."game_id") AND ("g"."league" = "rk"."league"))));


ALTER VIEW "public"."vw_games" OWNER TO "postgres";


ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_pkey" PRIMARY KEY ("user_email", "game_id", "league", "game_date", "home_team", "away_team");



ALTER TABLE ONLY "public"."rank_override"
    ADD CONSTRAINT "rank_override_pkey" PRIMARY KEY ("game_id", "league");



ALTER TABLE ONLY "public"."team_override"
    ADD CONSTRAINT "team_override_pkey" PRIMARY KEY ("league", "team_abbreviation");





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."arenas"("team" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."arenas"("team" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."arenas"("team" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."teams"("arena" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."teams"("arena" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."teams"("arena" "text") TO "service_role";


















GRANT ALL ON TABLE "public"."games" TO "anon";
GRANT ALL ON TABLE "public"."games" TO "authenticated";
GRANT ALL ON TABLE "public"."games" TO "service_role";



GRANT ALL ON TABLE "public"."rank_override" TO "anon";
GRANT ALL ON TABLE "public"."rank_override" TO "authenticated";
GRANT ALL ON TABLE "public"."rank_override" TO "service_role";



GRANT ALL ON TABLE "public"."team_override" TO "anon";
GRANT ALL ON TABLE "public"."team_override" TO "authenticated";
GRANT ALL ON TABLE "public"."team_override" TO "service_role";



GRANT ALL ON TABLE "public"."vw_games" TO "anon";
GRANT ALL ON TABLE "public"."vw_games" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_games" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


