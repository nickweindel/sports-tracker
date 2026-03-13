import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PHOTOS_BUCKET = "photos";

export interface GamePhotoResponse {
  id: string;
  game_id: number;
  storage_path: string;
  public_url: string;
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  try {
    const { searchParams } = new URL(req.url);
    const user_email = searchParams.get("user_email");
    const league = searchParams.get("league");
    const game_id = searchParams.get("game_id");

    if (!user_email || !league) {
      return NextResponse.json(
        { error: "Missing user_email or league" },
        { status: 400 },
      );
    }

    let query = supabase
      .from("game_photos")
      .select("id, game_id, storage_path")
      .eq("user_email", user_email)
      .eq("league", league)
      .order("created_at", { ascending: true });

    if (game_id != null && game_id !== "") {
      query = query.eq("game_id", parseInt(game_id, 10));
    }

    const { data: rows, error } = await query;

    if (error) {
      console.error("Supabase game_photos fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const photos: GamePhotoResponse[] = (rows ?? []).map((row) => {
      const { data } = supabase.storage
        .from(PHOTOS_BUCKET)
        .getPublicUrl(row.storage_path);
      return {
        id: row.id,
        game_id: row.game_id,
        storage_path: row.storage_path,
        public_url: data.publicUrl,
      };
    });

    return NextResponse.json({ photos });
  } catch (err) {
    console.error("API photos error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch photos" },
      { status: 500 },
    );
  }
}
