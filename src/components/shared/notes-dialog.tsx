import React, { useState } from "react";
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

interface NotesDialogProps {
  game: Game;
  open: boolean;
  onClose: () => void;
  onNotesUpdated?: (game_id: number, notes: string | null) => void; // optional callback to update parent
}

export const NotesDialog: React.FC<NotesDialogProps> = ({ game, open, onClose, onNotesUpdated }) => {
    const [notes, setNotes] = useState(game.notes || "");
    const [loading, setLoading] = useState(false);
  
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
            notes: notes, // can be empty string
          }),
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          console.error("Error saving notes:", data.error);
          setLoading(false);
          return;
        }
        
        if (onNotesUpdated) onNotesUpdated(game.game_id, notes.trim() === "" ? null : notes);
    
        onClose();
      } catch (err) {
        console.error("Network error:", err);
      } finally {
        setLoading(false);
      }
    };
    
  
    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{game.away_team_name} @ {game.home_team_name}</DialogTitle>
            <DialogDescription>{game.game_date}</DialogDescription>
          </DialogHeader>
  
          <div className="flex items-center justify-center my-4 space-x-4">
            <img src={game.away_team_logo} alt={game.away_team_name} className="w-16 h-16 object-contain" />
            <span className="text-xl font-bold">@</span>
            <img src={game.home_team_logo} alt={game.home_team_name} className="w-16 h-16 object-contain" />
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
            <Button onClick={onClose} variant="destructive">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  