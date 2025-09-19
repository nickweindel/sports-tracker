const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  database: 'sports_tracker',
  user: 'postgres',
  password: 'password',
  ssl: false,
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database connection successful!');
    console.log('Current time:', result.rows[0].current_time);
    
    // Test the nhl_games table
    const tableResult = await client.query('SELECT COUNT(*) as count FROM nhl_games');
    console.log('✅ nhl_games table exists with', tableResult.rows[0].count, 'records');
    
    client.release();
    await pool.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
