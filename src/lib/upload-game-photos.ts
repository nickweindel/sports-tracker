import { createClient } from "@/lib/supabase/client"
import { Game } from "@/types/game"

export async function uploadGamePhotos(files: FileList, game: Game, userEmail: string) {
  const supabase = await createClient()

  for (const file of Array.from(files)) {
    const path = `${userEmail}/${game.league}/${game.game_id}/${crypto.randomUUID()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(path, file)

    if (uploadError) throw uploadError

    const { error: dbError } = await supabase
      .from("game_photos")
      .insert({
        user_email: userEmail,
        game_id: game.game_id,
        league: game.league,
        game_date: game.game_date,
        home_team: game.home_team,
        away_team: game.away_team,
        storage_path: path
      })

    if (dbError) throw dbError
  }
}