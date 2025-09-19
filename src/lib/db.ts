import { Pool } from 'pg';

import { Game } from "@/types/game"

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
  async getAllGames(): Promise<Game[]> {
    const result = await query('SELECT * FROM nhl_games ORDER BY game_date DESC');
    return result.rows
  },

  // Insert a new game
  async insertGame(game: Game): Promise<Game> {
    const sql = `
      INSERT INTO nhl_games (
        game_date, home_team, home_team_name, home_team_score, home_team_logo,
        away_team, away_team_name, away_team_score, away_team_logo,
        game_center_link, arena
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const params = [
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
  }
};
