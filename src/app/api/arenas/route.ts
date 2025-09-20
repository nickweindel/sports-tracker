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
      const arenas = await db.getArenas(league)
      return NextResponse.json({ arenas })
    } catch (error) {
      console.error('Error fetching games:', error)
      return NextResponse.json(
        { error: 'Failed to fetch arenas' },
        { status: 500 }
      )
    }
}