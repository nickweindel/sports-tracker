import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  const apiSportsKey = process.env.apiSportsKey

  if (!date) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
  }

  if (!apiSportsKey) {
    return NextResponse.json({ error: 'No API key was provided'}, { status: 400 })
  }

  try {
    const response = await fetch(`https://api-nba-v1.p.rapidapi.com/games?date=${date}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
            "x-rapidapi-key": apiSportsKey
        }
    })
    
    if (!response.ok) {
      throw new Error(`NBA API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching NBA data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch NBA data' },
      { status: 500 }
    )
  }
}
