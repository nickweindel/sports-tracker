import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  try {
    const { user_email, game_id, notes } = await req.json();

    if (!user_email || !game_id) {
      return NextResponse.json({ error: "Missing user_email or game_id" }, { status: 400 });
    }

    const newNotes = notes?.trim() === "" ? null : notes;

    const { data, error } = await supabase
      .from("games")
      .update({ notes: newNotes })
      .eq("user_email", user_email)
      .eq("game_id", game_id);

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, updated: data });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
