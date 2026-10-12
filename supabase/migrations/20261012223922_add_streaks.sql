DROP FUNCTION IF EXISTS "public"."teams"("arena" "text");

CREATE OR REPLACE FUNCTION "public"."teams"("arena" "text" DEFAULT NULL::"text") RETURNS TABLE("user_email" "text", "league" "text", "team" "text", "team_logo" "text", "home_team_points_for" bigint, "home_team_points_against" bigint, "home_team_point_differential" bigint, "away_team_points_for" bigint, "away_team_points_against" bigint, "away_team_point_differential" bigint, "neutral_team_points_for" bigint, "neutral_team_points_against" bigint, "neutral_team_point_differential" bigint, "overall_team_points_for" bigint, "overall_team_points_against" bigint, "overall_team_point_differential" bigint, "home_wins" bigint, "home_losses" bigint, "home_ties" bigint, "away_wins" bigint, "away_losses" bigint, "away_ties" bigint, "neutral_wins" bigint, "neutral_losses" bigint, "neutral_ties" bigint, "overall_wins" bigint, "overall_losses" bigint, "overall_ties" bigint, "home_streak" text, "away_streak" text, "neutral_streak" text, "overall_streak" text)
    LANGUAGE "sql"
    AS $_$with
  cte_games AS (
      SELECT *
  FROM games g
  WHERE $1 IS NULL OR g.arena = $1
  )

, cte_team_game_results AS (
    SELECT
        g.user_email,
        g.league,
        g.home_team AS team,
        g.game_date,
        CASE
            WHEN g.home_team_score > g.away_team_score THEN 'W'
            WHEN g.home_team_score < g.away_team_score THEN 'L'
            ELSE 'T'
        END AS result,
        CASE
            WHEN g.neutral_site = true
              OR g.league = 'fifa.world'
                THEN 'neutral'
            ELSE 'home'
        END AS venue
    FROM cte_games g
    WHERE g.home_team_score IS NOT NULL
      AND g.away_team_score IS NOT NULL

    UNION ALL

    SELECT
        g.user_email,
        g.league,
        g.away_team AS team,
        g.game_date,
        CASE
            WHEN g.away_team_score > g.home_team_score THEN 'W'
            WHEN g.away_team_score < g.home_team_score THEN 'L'
            ELSE 'T'
        END AS result,
        CASE
            WHEN g.neutral_site = true
              OR g.league = 'fifa.world'
                THEN 'neutral'
            ELSE 'away'
        END AS venue
    FROM cte_games g
    WHERE g.home_team_score IS NOT NULL
      AND g.away_team_score IS NOT NULL
),

-- Calculate both overall and venue-specific streaks
cte_streak_scope AS (
    SELECT
        user_email,
        league,
        team,
        game_date,
        result,
        'overall'::text AS scope
    FROM cte_team_game_results

    UNION ALL

    SELECT
        user_email,
        league,
        team,
        game_date,
        result,
        venue AS scope
    FROM cte_team_game_results
),

cte_ordered_results AS (
    SELECT
        *,
        LAG(result) OVER (
            PARTITION BY user_email, league, team, scope
            ORDER BY game_date DESC
        ) AS previous_result
    FROM cte_streak_scope
),

cte_streak_groups AS (
    SELECT
        *,
        SUM(
            CASE
                WHEN previous_result IS DISTINCT FROM result
                    THEN 1
                ELSE 0
            END
        ) OVER (
            PARTITION BY user_email, league, team, scope
            ORDER BY game_date DESC
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS streak_group
    FROM cte_ordered_results
),

cte_current_streak AS (
    SELECT
        user_email,
        league,
        team,
        MAX(result || streak_count::text)
            FILTER (WHERE scope = 'home') AS home_streak,
        MAX(result || streak_count::text)
            FILTER (WHERE scope = 'away') AS away_streak,
        MAX(result || streak_count::text)
            FILTER (WHERE scope = 'neutral') AS neutral_streak,
        MAX(result || streak_count::text)
            FILTER (WHERE scope = 'overall') AS overall_streak
    FROM (
        SELECT
            user_email,
            league,
            team,
            scope,
            streak_group,
            MAX(result) AS result,
            COUNT(*) AS streak_count
        FROM cte_streak_groups
        WHERE streak_group = 1
        GROUP BY
            user_email,
            league,
            team,
            scope,
            streak_group
    ) streaks
    GROUP BY
        user_email,
        league,
        team
)

,cte_home_record as (
    select
      games.user_email,
      games.league,
      games.home_team as team,
      games.home_team_logo as team_logo,
      sum(games.home_team_score) AS home_team_points_for,
      sum(games.away_team_score) AS home_team_points_against,
      sum(games.home_team_score - games.away_team_score) AS home_team_point_differential,
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
      sum(games.away_team_score) AS away_team_points_for,
      sum(games.home_team_score) AS away_team_points_against,
      sum(games.away_team_score - games.home_team_score) AS away_team_point_differential,
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
      sum(games.home_team_score) AS home_team_points_for,
      sum(games.away_team_score) AS home_team_points_against,
      sum(games.home_team_score - games.away_team_score) AS home_team_point_differential,
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
    or 
      games.league = 'fifa.world'
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
      sum(games.away_team_score) AS away_team_points_for,
      sum(games.home_team_score) AS away_team_points_against,
      sum(games.away_team_score - games.home_team_score) AS away_team_point_differential,
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
    or 
      games.league = 'fifa.world'
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
      sum(COALESCE(home.home_team_points_for, 0::bigint)) as home_team_points_for,
      sum(COALESCE(home.home_team_points_against, 0::bigint)) as home_team_points_against,
      sum(COALESCE(home.home_team_point_differential, 0::bigint)) as home_team_point_differential,
      sum(COALESCE(away.away_team_points_for, 0::bigint)) as away_team_points_for,
      sum(COALESCE(away.away_team_points_against, 0::bigint)) as away_team_points_against,
      sum(COALESCE(away.away_team_point_differential, 0::bigint)) as away_team_point_differential,
      sum(
        COALESCE(nhome.home_team_points_for, 0::bigint) + COALESCE(naway.away_team_points_for, 0::bigint)
      ) as neutral_team_points_for,
      sum(
        COALESCE(nhome.home_team_points_against, 0::bigint) + COALESCE(naway.away_team_points_against, 0::bigint)
      ) as neutral_team_points_against,
      sum(
        COALESCE(nhome.home_team_point_differential, 0::bigint) + COALESCE(naway.away_team_point_differential, 0::bigint)
      ) as neutral_team_point_differential,
      sum(
        COALESCE(home.home_team_points_for, 0::bigint) + COALESCE(away.away_team_points_for, 0::bigint) + COALESCE(nhome.home_team_points_for, 0::bigint) + COALESCE(naway.away_team_points_for, 0::bigint)
      ) as overall_team_points_for,
      sum(
        COALESCE(home.home_team_points_against, 0::bigint) + COALESCE(away.away_team_points_against, 0::bigint) + COALESCE(nhome.home_team_points_against, 0::bigint) + COALESCE(naway.away_team_points_against, 0::bigint)
      ) as overall_team_points_against,
      sum(
        COALESCE(home.home_team_point_differential, 0::bigint) + COALESCE(away.away_team_point_differential, 0::bigint) + COALESCE(nhome.home_team_point_differential, 0::bigint) + COALESCE(naway.away_team_point_differential, 0::bigint)
      ) as overall_team_point_differential,
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
  sum(r.home_team_points_for) as home_team_points_for,
  sum(r.home_team_points_against) as home_team_points_against,
  sum(r.home_team_point_differential) as home_team_point_differential,
  sum(r.away_team_points_for) as away_team_points_for,
  sum(r.away_team_points_against) as away_team_points_against,
  sum(r.away_team_point_differential) as away_team_point_differential,
  sum(r.neutral_team_points_for) as neutral_team_points_for,
  sum(r.neutral_team_points_against) as neutral_team_points_against,
  sum(r.neutral_team_point_differential) as neutral_team_point_differential,
  sum(r.overall_team_points_for) as overall_team_points_for,
  sum(r.overall_team_points_against) as overall_team_points_against,
  sum(r.overall_team_point_differential) as overall_team_point_differential,
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
  sum(r.overall_ties) as overall_ties,
  max(s.home_streak) AS home_streak,
  max(s.away_streak) AS away_streak,
  max(s.neutral_streak) AS neutral_streak,
  max(s.overall_streak) AS overall_streak
from
  cte_full_records r
  left join team_override o on r.league = o.league
  and r.team = o.team_abbreviation
  left join cte_current_streak s on r.user_email = s.user_email
  and r.league = s.league
  and r.team = s.team
group by
  r.user_email,
  r.league,
  (COALESCE(o.team_abbreviation_override, r.team)),
  (COALESCE(o.team_logo, r.team_logo))$_$;