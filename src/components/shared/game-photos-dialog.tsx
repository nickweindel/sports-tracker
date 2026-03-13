"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Game } from "@/types/game";
import { GamePhoto, fetchGamePhotos } from "@/lib/photos";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface GamePhotosDialogProps {
  game: Game;
  open: boolean;
  onClose: () => void;
}

export function GamePhotosDialog({
  game,
  open,
  onClose,
}: GamePhotosDialogProps) {
  const [photos, setPhotos] = useState<GamePhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open || !game) return;

    setLoading(true);
    setIndex(0);
    fetchGamePhotos({
      user_email: game.user_email,
      league: game.league,
      game_id: game.game_id,
    })
      .then(setPhotos)
      .catch((err) => {
        console.error("Failed to load photos:", err);
        setPhotos([]);
      })
      .finally(() => setLoading(false));
  }, [open, game?.user_email, game?.league, game?.game_id]);

  const current = photos[index] ?? null;
  const hasMultiple = photos.length > 1;
  const goPrev = () => setIndex((i) => (i <= 0 ? photos.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i >= photos.length - 1 ? 0 : i + 1));

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-[90vw] sm:max-w-4xl w-full">
        <DialogHeader>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <img
              src={game.away_team_logo}
              alt=""
              className="w-12 h-12 object-contain shrink-0"
            />
            <DialogTitle className="text-center">
              {game.away_team_name} @ {game.home_team_name}
            </DialogTitle>
            <img
              src={game.home_team_logo}
              alt=""
              className="w-12 h-12 object-contain shrink-0"
            />
          </div>
          <DialogDescription className="text-center">
            {game.game_date} — {photos.length} photo
            {photos.length !== 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center min-h-[360px]">
            <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
          </div>
        ) : photos.length === 0 ? (
          <div className="flex items-center justify-center min-h-[360px] text-muted-foreground">
            No photos for this game.
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {hasMultiple && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={goPrev}
                aria-label="Previous photo"
                className="shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}

            <div className="flex-1 flex justify-center min-h-[360px] bg-muted/30 rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.public_url}
                alt={`Game photo ${index + 1} of ${photos.length}`}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            {hasMultiple && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={goNext}
                aria-label="Next photo"
                className="shrink-0"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}
          </div>
        )}

        {hasMultiple && !loading && photos.length > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            {index + 1} / {photos.length}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
