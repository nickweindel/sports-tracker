import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
    const teamRecords = await db.getTeamRecords(league)
    return NextResponse.json({ teamRecords })
  } catch (error) {
    console.error('Error fetching team records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team records' },
      { status: 500 }
    )
  }
}
