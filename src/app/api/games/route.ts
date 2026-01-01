import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    const gameData = await request.json();

    const { user_email, game_date, home_team, away_team, league } = gameData;

    if ( !user_email || !game_date || !home_team || !away_team || !league) {
      return NextResponse.json(
        { error: 'Missing required fields: user_email, league, game_date, home_team, away_team' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.from('games').insert([gameData]).select().single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save game' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Game saved successfully', game: data }, { status: 201 });
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user');
    const league = searchParams.get('league');
    const arena = searchParams.get('arena');

    if (!league) {
      return NextResponse.json({ error: 'No league was specified' }, { status: 400 });
    }

    let query = supabase
      .from('vw_games')
      .select('*')
      .eq('league', league)
      .eq('user_email', user)
      .order('game_date', { ascending: false });

    if (arena) {
      query = query.eq('arena', arena);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }

    return NextResponse.json({ games: data });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  try {
    const gameData = await request.json();
    const { user_email, league, game_date, home_team, away_team } = gameData;

    if (!user_email || !league || !game_date || !home_team || !away_team) {
      return NextResponse.json(
        { error: 'Missing required fields: user_email, league, game_date, home_team, away_team' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('games')
      .delete()
      .match({ user_email, league, game_date, home_team, away_team })
      .select()
      .single();

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json(
        { error: 'Game not found or could not be deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Game deleted successfully', game: data }, { status: 200 });
  } catch (error) {
    console.error('Error processing delete:', error);
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
