import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const teamRecords = await db.getTeamRecords()
    return NextResponse.json({ teamRecords })
  } catch (error) {
    console.error('Error fetching team records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team records' },
      { status: 500 }
    )
  }
}
