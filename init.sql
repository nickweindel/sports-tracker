-- Initialize the sports games database
-- This script creates the games table

-- Create table for NHL games
CREATE TABLE IF NOT EXISTS games (
    game_id INTEGER NOT NULL,
    league TEXT NOT NULL, 
    game_date DATE NOT NULL,
    home_team TEXT NOT NULL,
    home_team_name TEXT NOT NULL,
    home_team_score INTEGER NOT NULL,
    home_team_logo TEXT NOT NULL,
    home_team_rank TEXT NULL,
    away_team TEXT NOT NULL,
    away_team_name TEXT NOT NULL,
    away_team_score INTEGER NOT NULL,
    away_team_logo TEXT NOT NULL,
    away_team_rank TEXT NULL,
    game_center_link TEXT,
    arena TEXT NOT NULL,
    arena_city TEXT NOT NULL,
    arena_state TEXT NOT NULL,
    arena_country TEXT NOT NULL,
    PRIMARY KEY (game_id, league, game_date, home_team, away_team)
);