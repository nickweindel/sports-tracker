"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ScoreCard } from "./team-score";
import { MapPin, Trash2, ChevronDown, ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Game } from "@/types/game";
import { Pencil, Camera } from "lucide-react";
import { NotesAndPhotosDialog } from "./notes-and-photos-dialog";
import { GamePhotosDialog } from "./game-photos-dialog";
import { fetchGamePhotos } from "@/lib/photos";

interface GameCardsProps {
  gamesData: Game[];
  setGamesData: React.Dispatch<React.SetStateAction<Game[]>>;
  onDelete: (game: Game) => void;
}

export function GameCards({
  gamesData,
  setGamesData,
  onDelete,
}: GameCardsProps) {
  const logoDimensions: number = 64;
  const iconDimensions: number = 18;
  const footerIconDimensions: number = 20;

  // Track which notes are open by game index
  const [openNotes, setOpenNotes] = useState<boolean[]>([]);
  // Photo counts per game_id (game_id -> count)
  const [photoCountByGameId, setPhotoCountByGameId] = useState<
    Record<number, number>
  >({});
  // Which game's photos dialog is open
  const [photosDialogOpen, setPhotosDialogOpen] = useState(false);
  const [gameForPhotos, setGameForPhotos] = useState<Game | null>(null);

  const toggleNotes = (index: number) => {
    const newOpenNotes = [...openNotes];
    newOpenNotes[index] = !newOpenNotes[index];
    setOpenNotes(newOpenNotes);
  };

  // Fetch photo counts when games load
  const firstGame = gamesData[0];
  useEffect(() => {
    if (!firstGame?.user_email || !firstGame?.league) return;

    fetchGamePhotos({
      user_email: firstGame.user_email,
      league: firstGame.league,
    })
      .then((photos) => {
        const counts: Record<number, number> = {};
        for (const p of photos) {
          counts[p.game_id] = (counts[p.game_id] ?? 0) + 1;
        }
        setPhotoCountByGameId(counts);
      })
      .catch((err) => {
        console.error("Failed to fetch photo counts:", err);
      });
  }, [firstGame?.user_email, firstGame?.league, gamesData.length]);

  const refreshPhotoCounts = () => {
    if (!firstGame?.user_email || !firstGame?.league) return;
    fetchGamePhotos({
      user_email: firstGame.user_email,
      league: firstGame.league,
    })
      .then((photos) => {
        const counts: Record<number, number> = {};
        for (const p of photos) {
          counts[p.game_id] = (counts[p.game_id] ?? 0) + 1;
        }
        setPhotoCountByGameId(counts);
      })
      .catch(console.error);
  };

  // Track which notes dialog is open and if the dialog is open, period
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  return (
    <>
      {gamesData.map((game, index) => (
        <Card key={index}>
          <CardHeader className="font-semibold text-center">
            <CardTitle>
              {/* TODO: do this more elegantly */}
              {new Date(game.game_date + "T00:00:00").toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </CardTitle>
            <CardDescription>
              {game.away_team} @ {game.home_team}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center">
              <ScoreCard
                score={game.away_team_score}
                logoSrc={game.away_team_logo}
                logoDimensions={logoDimensions}
                logoFirst={true}
                rank={game.away_team_rank}
              />
            </div>
            <div className="flex flex-row items-center">
              <MapPin height={iconDimensions} width={iconDimensions} />
              <div className="font-light">{game.arena}</div>
            </div>
            <div className="flex flex-row items-center">
              <ScoreCard
                score={game.home_team_score}
                logoSrc={game.home_team_logo}
                logoDimensions={logoDimensions}
                logoFirst={false}
                rank={game.home_team_rank}
              />
            </div>
          </CardContent>
          {(game.notes || (photoCountByGameId[game.game_id] ?? 0) > 0) && (
            <>
              <div className="flex items-center justify-center w-full py-2 text-sm text-gray-500">
                {game.notes && (
                  <div
                    onClick={() => toggleNotes(index)}
                    className="flex items-center hover:text-gray-700 cursor-pointer"
                  >
                    <span>
                      {openNotes[index] ? "Hide Notes" : "Show Notes"}
                    </span>
                    <ChevronDown
                      className={`ml-2 w-4 h-4 transition-transform duration-200 ease-in-out ${
                        openNotes[index] ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                )}
                {game.notes && (photoCountByGameId[game.game_id] ?? 0) > 0 && (
                  <div className="border-l-2 mx-2 h-6"></div>
                )}
                {(photoCountByGameId[game.game_id] ?? 0) > 0 && (
                  <div
                    onClick={() => {
                      setGameForPhotos(game);
                      setPhotosDialogOpen(true);
                    }}
                    className="flex items-center hover:text-gray-700 cursor-pointer"
                  >
                    <ImageIcon className="mr-2 w-4 h-4" />
                    <span>
                      {photoCountByGameId[game.game_id]} photo
                      {photoCountByGameId[game.game_id] !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
              {openNotes[index] && game.notes && (
                <div className="px-4 pb-4 text-sm text-gray-700 text-center">
                  {game.notes}
                </div>
              )}
            </>
          )}
          <CardFooter className="font-light text-sm flex justify-center">
            <span className="flex flex-row items-center">
              {game.game_center_link && (
                <>
                  <a
                    href={`${game.game_center_link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Game recap
                  </a>
                  <div className="border-l-2 mx-2 h-6"></div>
                </>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-11 shrink-0 flex items-center justify-center gap-1"
                    onClick={() => {
                      setSelectedGame(game);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-5 w-5" />
                    <Camera className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Add additional content for this game (notes and photos)
                </TooltipContent>
              </Tooltip>
              <div className="border-l-2 mx-2 h-6"></div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Trash2
                    className={`w-[${footerIconDimensions}px] h-[${footerIconDimensions}px] cursor-pointer`}
                    onClick={() => onDelete(game)}
                  />
                </TooltipTrigger>
                <TooltipContent side="top">Delete game</TooltipContent>
              </Tooltip>
            </span>
          </CardFooter>
        </Card>
      ))}

      {selectedGame && (
        <NotesAndPhotosDialog
          game={selectedGame} // guaranteed non-null
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setSelectedGame(null);
          }}
          onNotesUpdated={(game_id, newNotes) => {
            setGamesData((prev) =>
              prev.map((g) =>
                g.game_id === game_id ? { ...g, notes: newNotes } : g,
              ),
            );
          }}
          onPhotosUploaded={refreshPhotoCounts}
        />
      )}

      {gameForPhotos && (
        <GamePhotosDialog
          game={gameForPhotos}
          open={photosDialogOpen}
          onClose={() => {
            setPhotosDialogOpen(false);
            setGameForPhotos(null);
          }}
        />
      )}
    </>
  );
}
