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