import { Pool } from 'pg';

import { Arena } from "@/types/arena";
import { Game } from "@/types/game";
import { TeamRecord } from "@/types/team-record";

// Database connection pool
const pool = new Pool({
  host: 'localhost',
  port: 5433,
  database: 'sports_tracker',
  user: 'postgres',
  password: 'password',
  ssl: false, // Disable SSL for local development
});

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Execute a query with parameters
export async function query(text: string, params?: any[]): Promise<any> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Close the pool (call this when shutting down the app)
export async function closePool(): Promise<void> {
  await pool.end();
}

// Database operations
export const db = {
  // Get all games seen
  async getAllGames(league: string): Promise<Game[]> {
    const result = await query(`SELECT * FROM games WHERE league = '${league}' ORDER BY game_date DESC`);
    return result.rows
  },

  // Get arenas
  async getArenas(league: string): Promise<Arena[]> {
    const result = await query(`
      SELECT 
         league,
         arena,
         COUNT(*) AS visits
      FROM 
         games
      WHERE 
         league = '${league}'
      GROUP BY 
        league,
        arena      
      `)
    return result.rows
  },

  // Get team records
  async getTeamRecords(league: string): Promise<TeamRecord[]> {
    const result = await query(`
      WITH cte_home_record AS(
        SELECT 
          league AS league,
          home_team AS team, 
          home_team_logo AS team_logo,
          SUM(CASE 
            WHEN home_team_score > away_team_score 
            THEN 1
            ELSE 0 
          END) AS home_team_wins,
          SUM(CASE 
            WHEN home_team_score < away_team_score
            THEN 1 
            ELSE 0 
          END) AS home_team_losses,
          SUM(CASE
            WHEN home_team_score = away_team_score
            THEN 1
            ELSE 0
          END) AS home_team_ties
        FROM 
          games
        WHERE 
          league = '${league}'
        GROUP BY 
          league,
          home_team,
          home_team_logo
      )

      ,cte_away_record AS(
        SELECT 
          league AS league,
          away_team AS team,
          away_team_logo AS team_logo,
          SUM(CASE 
            WHEN away_team_score > home_team_score
            THEN 1
            ELSE 0
          END) AS away_team_wins,
          SUM(CASE 
            WHEN away_team_score < home_team_score
            THEN 1 
            ELSE 0 
          END) AS away_team_losses,
          SUM(CASE
            WHEN away_team_score = home_team_score
            THEN 1
            ELSE 0
          END) AS away_team_ties
        FROM 
          games
        WHERE 
          league = '${league}'
        GROUP BY 
          league,
          away_team,
          away_team_logo
      )

      SELECT
        COALESCE(home.league, away.league) AS league,
        COALESCE(home.team, away.team) AS team,
        COALESCE(home.team_logo, away.team_logo) AS team_logo,
        SUM(COALESCE(home.home_team_wins, 0)) AS home_wins,
        SUM(COALESCE(home.home_team_losses, 0)) AS home_losses,
        SUM(COALESCE(home.home_team_ties,0)) AS home_ties,
        SUM(COALESCE(away.away_team_wins, 0)) AS away_wins,
        SUM(COALESCE(away.away_team_losses, 0)) AS away_losses,
        SUM(COALESCE(away.away_team_ties,0)) AS away_ties,
        SUM(COALESCE(home.home_team_wins, 0) + COALESCE(away.away_team_wins, 0)) AS overall_wins,
        SUM(COALESCE(home.home_team_losses, 0) + COALESCE(away.away_team_losses, 0)) AS overall_losses,
        SUM(COALESCE(home.home_team_ties,0) + COALESCE(away.away_team_ties,0)) AS overall_ties
      FROM 
        cte_home_record home
      FULL OUTER JOIN
        cte_away_record away 
      ON 
        home.team = away.team
      AND 
        home.league = away.league 
      GROUP BY 
        COALESCE(home.league, away.league),
        COALESCE(home.team, away.team),
        COALESCE(home.team_logo, away.team_logo)
      `);
    return result.rows;
  },

  // Insert a new game
  async insertGame(game: Game): Promise<Game> {
    const sql = `
      INSERT INTO games (
        league, game_date, home_team, home_team_name, home_team_score,
        home_team_logo, away_team, away_team_name, away_team_score,
        away_team_logo, game_center_link, arena
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const params = [
      game.league,
      game.game_date,
      game.home_team,
      game.home_team_name,
      game.home_team_score,
      game.home_team_logo,
      game.away_team,
      game.away_team_name,
      game.away_team_score,
      game.away_team_logo,
      game.game_center_link,
      game.arena
    ];

    const result = await query(sql, params);
    return result.rows[0];
  },

  // Delete a game. 
  async deleteGame(game: Game): Promise<Game | null> {
    const { league, game_date, home_team, away_team } = game;
    
    try {
      // Run your DELETE SQL query (assuming you're using a PostgreSQL database)
      const result = await query(
        'DELETE FROM games WHERE league = $1 AND game_date = $2 AND home_team = $3 AND away_team = $4 RETURNING *',
        [league, game_date, home_team, away_team]
      );
      
      // If no rows are deleted, return null
      if (result.rowCount === 0) {
        return null;
      }
  
      // Return the deleted game data (the first row from the result)
      return result.rows[0] as Game;  // Casting result to Game type
    } catch (error) {
      console.error('Error deleting game:', error);
      throw new Error('Failed to delete game');
    }
  }
}
