-- Initialize the sports games database
-- This script creates the nhl_games table

-- Create table for NHL games
CREATE TABLE IF NOT EXISTS nhl_games (
    game_date DATE NOT NULL,
    home_team VARCHAR(3) NOT NULL,
    home_team_name VARCHAR(50) NOT NULL,
    home_team_score INTEGER NOT NULL,
    home_team_logo TEXT NOT NULL,
    away_team VARCHAR(3) NOT NULL,
    away_team_name VARCHAR(50) NOT NULL,
    away_team_score INTEGER NOT NULL,
    away_team_logo TEXT NOT NULL,
    game_center_link TEXT NOT NULL,
    arena VARCHAR(100) NOT NULL,
    PRIMARY KEY (game_date, home_team, away_team)
);