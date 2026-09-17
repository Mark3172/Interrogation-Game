import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await getSupabase()
      .from('leaderboard')
      .select('player_name, turns_taken, created_at')
      .order('turns_taken', { ascending: true })
      .limit(5);

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Leaderboard GET error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { player_name, turns_taken } = await request.json();

    if (!player_name || typeof player_name !== 'string' || player_name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Player name is required' },
        { status: 400 }
      );
    }

    if (!turns_taken || typeof turns_taken !== 'number' || turns_taken < 1) {
      return NextResponse.json(
        { error: 'Valid turns_taken is required' },
        { status: 400 }
      );
    }

    const { data, error } = await getSupabase()
      .from('leaderboard')
      .insert([{
        player_name: player_name.trim().substring(0, 30),
        turns_taken: turns_taken,
      }])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save score' },
        { status: 500 }
      );
    }

    return NextResponse.json(data?.[0] || { success: true }, { status: 201 });
  } catch (error) {
    console.error('Leaderboard POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
