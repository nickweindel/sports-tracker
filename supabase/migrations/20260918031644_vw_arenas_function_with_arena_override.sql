CREATE OR REPLACE FUNCTION "public"."arenas"("team" "text" DEFAULT NULL::"text") RETURNS TABLE("user_email" "text", "league" "text", "arena" "text", "visits" bigint)
    LANGUAGE "sql"
    AS $$
  SELECT
    user_email,
    league,
    arena,
    COUNT(*) AS visits
  FROM vw_games
  WHERE
    team IS NULL
    OR home_team = team
    OR away_team = team
  GROUP BY
    user_email,
    league,
    arena;
$$;