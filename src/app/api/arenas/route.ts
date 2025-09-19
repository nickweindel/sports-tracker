import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
    try {
      const arenas = await db.getArenas()
      return NextResponse.json({ arenas })
    } catch (error) {
      console.error('Error fetching games:', error)
      return NextResponse.json(
        { error: 'Failed to fetch arenas' },
        { status: 500 }
      )
    }
}