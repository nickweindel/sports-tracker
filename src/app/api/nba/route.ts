import { NextRequest, NextResponse } from 'next/server';
import { API_BASE, API_PATH } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  if (!date) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
  }

  try {
    const response = await fetch(`${API_BASE}/basketball/nba/${API_PATH}?dates=${date}`)
    
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
