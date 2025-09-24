import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/utils/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient(); 

  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get('league');
    const user = searchParams.get('user');

    if (!league) {
      return NextResponse.json(
        { error: 'No league was specified' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('league', league)
    .eq('user_email', user)

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
    }

    return NextResponse.json({ teams: data });
  } catch (error) {
    console.error('Error fetching team records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team records' },
      { status: 500 }
    )
  }
}
