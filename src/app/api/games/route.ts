import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
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
    try {
      const savedGame = await db.insertGame(gameData)
      console.log(`Game saved successfully:`, savedGame)
      
      return NextResponse.json(
        { 
          message: 'Game saved successfully',
          game: savedGame
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get('league');

    if (!league) {
      return NextResponse.json(
        { error: 'No league was specified' },
        { status: 500 }
      )
    }

    const games = await db.getAllGames(league)
    return NextResponse.json({ games })
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
}

// DELETE method to remove a game from the database
export async function DELETE(request: NextRequest) {
  try {
    const gameData: Game = await request.json();

    // Validate required fields
    if (!gameData.league || !gameData.game_date || !gameData.home_team || !gameData.away_team) {
      return NextResponse.json(
        { error: 'Missing required fields: league, game_date, home_team, away_team' },
        { status: 400 }
      );
    }

    // Perform the delete operation in the database
    try {
      const deletedGame = await db.deleteGame(gameData);

      if (deletedGame) {
        return NextResponse.json(
          { message: 'Game deleted successfully', game: deletedGame },
          { status: 200 }
        );
      } else {
        // If no rows are deleted, return a 404 (Not Found)
        return NextResponse.json(
          { error: 'Game not found or could not be deleted' },
          { status: 404 }
        );
      }
    } catch (err) {
      console.error('Database error:', err);
      return NextResponse.json(
        { error: 'Failed to delete game from database' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error processing game data:', error);
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}