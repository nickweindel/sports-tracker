import type { SupabaseClient } from "@supabase/supabase-js";

const PHOTOS_BUCKET = "photos";

export interface GamePhoto {
  id: string;
  game_id: number;
  storage_path: string;
  public_url: string;
}

/**
 * Fetches photos for a user's league, optionally filtered by game_id.
 * Returns photos with public_url for display.
 */
export async function fetchGamePhotos(params: {
  user_email: string;
  league: string;
  game_id?: number;
}): Promise<GamePhoto[]> {
  const url = new URL("/api/photos", window.location.origin);
  url.searchParams.set("user_email", params.user_email);
  url.searchParams.set("league", params.league);
  if (params.game_id != null) {
    url.searchParams.set("game_id", String(params.game_id));
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to fetch photos");
  }
  const data = await res.json();
  return data.photos ?? [];
}

export interface GamePhotoPayload {
  user_email: string;
  game_id: number;
  league: string;
  game_date: string;
  home_team: string;
  away_team: string;
}

export interface UploadResult {
  success: boolean;
  error?: string;
}

/**
 * Uploads a single photo to Supabase storage and inserts metadata into game_photos.
 */
export async function uploadGamePhoto(
  supabase: SupabaseClient,
  file: File,
  game: GamePhotoPayload,
): Promise<UploadResult> {
  const path = `${game.user_email}/${game.league}/${game.game_id}/${crypto.randomUUID()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .upload(path, file);

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const { error: dbError } = await supabase.from("game_photos").insert({
    user_email: game.user_email,
    game_id: game.game_id,
    league: game.league,
    game_date: game.game_date,
    home_team: game.home_team,
    away_team: game.away_team,
    storage_path: path,
  });

  if (dbError) {
    return { success: false, error: dbError.message };
  }

  return { success: true };
}

/**
 * Uploads multiple photos for a game. Continues on per-file errors and returns
 * counts of successes and failures.
 */
export async function uploadGamePhotos(
  supabase: SupabaseClient,
  files: File[],
  game: GamePhotoPayload,
): Promise<{ uploaded: number; failed: number; errors: string[] }> {
  const errors: string[] = [];
  let uploaded = 0;

  for (const file of files) {
    const result = await uploadGamePhoto(supabase, file, game);
    if (result.success) {
      uploaded++;
    } else {
      errors.push(result.error ?? "Unknown error");
    }
  }

  return {
    uploaded,
    failed: files.length - uploaded,
    errors,
  };
}
