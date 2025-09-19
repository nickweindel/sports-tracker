import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/api/database'
import { Game } from '@/types/game'

export async function POST(request: NextRequest) {
  try {
    const gameData: Game = await request.json()

    // Validate required fields
    if (!gameData.game_date || !gameData.home_team || !gameData.away_team) {
      return NextResponse.json(
        { error: 'Missing required fields: game_date, home_team, away_team' },
        { status: 400 }
      )
    }

    // Insert the game into the database
    const sql = `
      INSERT INTO games (
        game_date, home_team, home_team_name, home_team_score, home_team_logo,
        away_team, away_team_name, away_team_score, away_team_logo,
        game_center_link, arena
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      gameData.game_date,
      gameData.home_team,
      gameData.home_team_name,
      gameData.home_team_score,
      gameData.home_team_logo,
      gameData.away_team,
      gameData.away_team_name,
      gameData.away_team_score,
      gameData.away_team_logo,
      gameData.game_center_link,
      gameData.arena
    ]

    try {
      const result = db.prepare(sql).run(params)
      console.log(`Game saved with ID: ${result.lastInsertRowid}`)
      
      return NextResponse.json(
        { 
          message: 'Game saved successfully',
          id: result.lastInsertRowid,
          game: gameData
        },
        { status: 201 }
      )
    } catch (err) {
      console.error('Database error:', err)
      return NextResponse.json(
        { error: 'Failed to save game to database' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error processing game data:', error)
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}

export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM games ORDER BY game_date DESC')
    const rows = stmt.all()
    return NextResponse.json({ games: rows })
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
}
