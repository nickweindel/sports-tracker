import { NextRequest, NextResponse } from 'next/server';
import { API_BASE, API_PATH } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  if (!date) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
  }

  try {
    const response = await fetch(`${API_BASE}/football/college-football/${API_PATH}?dates=${date}`)
    
    if (!response.ok) {
      throw new Error(`CFB API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching CFB data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch CFB data' },
      { status: 500 }
    )
  }
}
