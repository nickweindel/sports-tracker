"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Game } from "@/types/game";
import { createClient } from "@/lib/supabase/client";
import { Loader2, UploadCloud } from "lucide-react";

interface NotesAndPhotosDialogProps {
  game: Game;
  open: boolean;
  onClose: () => void;
  onNotesUpdated?: (game_id: number, notes: string | null) => void;
}

export const NotesAndPhotosDialog: React.FC<NotesAndPhotosDialogProps> = ({
  game,
  open,
  onClose,
  onNotesUpdated,
}) => {
  const [notes, setNotes] = useState(game.notes || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Reset notes whenever a new game opens
  React.useEffect(() => {
    if (open) setNotes(game.notes || "");
  }, [open, game.notes]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/update-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: game.user_email,
          game_id: game.game_id,
          notes: notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error saving notes:", data.error);
        setLoading(false);
        return;
      }

      if (onNotesUpdated)
        onNotesUpdated(game.game_id, notes.trim() === "" ? null : notes);

      onClose();
    } catch (err) {
      console.error("Network error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Photo Upload Logic ---
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setUploading(true);

    try {
      for (const file of Array.from(e.target.files)) {
        const path = `${game.user_email}/${
          game.league
        }/${game.game_id}/${crypto.randomUUID()}-${file.name}`;

        // Upload to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(path, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        // Insert metadata in game_photos table
        const { error: dbError } = await supabase.from("game_photos").insert({
          user_email: game.user_email,
          game_id: game.game_id,
          league: game.league,
          game_date: game.game_date,
          home_team: game.home_team,
          away_team: game.away_team,
          storage_path: path,
        });

        if (dbError) console.error("DB insert error:", dbError);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {game.away_team_name} @ {game.home_team_name}
          </DialogTitle>
          <DialogDescription>{game.game_date}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center my-4 space-x-4">
          <img
            src={game.away_team_logo}
            alt={game.away_team_name}
            className="w-16 h-16 object-contain"
          />
          <span className="text-xl font-bold">@</span>
          <img
            src={game.home_team_logo}
            alt={game.home_team_name}
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex justify-center items-center mb-4">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center space-x-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-5 h-5" />
                <span>Upload Photos</span>
              </>
            )}
          </Button>

          {uploading && (
            <span className="text-sm text-gray-500 flex items-center space-x-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading files...</span>
            </span>
          )}
        </div>

        <Textarea
          placeholder="Add notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mb-4"
          rows={4}
        />

        <div className="flex justify-end space-x-2">
          <Button onClick={handleSubmit} disabled={loading} variant="default">
            Submit
          </Button>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
