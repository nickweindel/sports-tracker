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
    TooltipTrigger
} from "@/components/ui/tooltip";
import { ScoreCard } from "./team-score";
import { MapPin, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Game } from "@/types/game";
import { Pencil } from "lucide-react";
import { NotesDialog } from "./notes-dialog";

interface GameCardsProps {
    gamesData: Game[];
    setGamesData: React.Dispatch<React.SetStateAction<Game[]>>; 
    onDelete: (game: Game) => void;
}

export function GameCards({gamesData, setGamesData, onDelete} : GameCardsProps) {
    const logoDimensions: number = 64;
    const iconDimensions: number = 18;
    const footerIconDimensions: number = 20;

    // Track which notes are open by game index
    const [openNotes, setOpenNotes] = useState<boolean[]>([]);

    const toggleNotes = (index: number) => {
        const newOpenNotes = [...openNotes];
        newOpenNotes[index] = !newOpenNotes[index];
        setOpenNotes(newOpenNotes);
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
                            {/* TODO: do this more elegantly */ }
                            {new Date(game.game_date + 'T00:00:00').toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
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
                                rank={game.away_team_rank} />
                         </div>
                         <div className="flex flex-row items-center">
                            <MapPin height={iconDimensions} width={iconDimensions} />
                            <div className="font-light">
                                {game.arena}
                            </div>
                         </div>
                         <div className="flex flex-row items-center">
                            <ScoreCard 
                                score={game.home_team_score} 
                                logoSrc={game.home_team_logo} 
                                logoDimensions={logoDimensions}
                                logoFirst={false}
                                rank={game.home_team_rank} />
                         </div>
                     </CardContent>
                     {game.notes && (
                        <>
                            <div
                                onClick={() => toggleNotes(index)}
                                className="flex items-center justify-center w-full py-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                <span>{openNotes[index] ? "Hide Notes" : "Show Notes"}</span>
                                <ChevronDown
                                    className={`ml-2 w-4 h-4 transition-transform duration-200 ease-in-out ${
                                        openNotes[index] ? "rotate-180" : ""
                                    }`}
                                />
                            </div>
                            {openNotes[index] && (
                                <div className="px-4 pb-4 text-sm text-gray-700 text-center">
                                    {game.notes}
                                </div>
                            )}
                        </>
                    )}
                     <CardFooter className="font-light text-sm flex justify-center">
                        <span className="flex flex-row">
                            {game.game_center_link && (
                                <>
                                    <a 
                                        href={`${game.game_center_link}`}
                                        target="_blank" rel="noopener noreferrer" 
                                        className="text-blue-600 hover:text-blue-800 underline">Game recap</a>
                                    <div className="border-l-2 mx-2 h-6"></div> 
                                </>
                            )}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                <Pencil
                                    className={`w-[${footerIconDimensions}px] h-[${footerIconDimensions}px] cursor-pointer`}
                                    onClick={() => {
                                        setSelectedGame(game); // set game
                                        setDialogOpen(true);   // open dialog
                                    }}
                                />
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    Edit notes for game
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
                                <TooltipContent side="top">
                                    Delete game
                                </TooltipContent>
                            </Tooltip>
                        </span>
                     </CardFooter>
                </Card>
            ))}

            {selectedGame && (
                <NotesDialog
                    game={selectedGame} // guaranteed non-null
                    open={dialogOpen}
                    onClose={() => {
                        setDialogOpen(false);
                        setSelectedGame(null);
                    }}
                    onNotesUpdated={(game_id, newNotes) => {
                        setGamesData((prev) =>
                            prev.map((g) => (g.game_id === game_id ? { ...g, notes: newNotes } : g))
                        );
                    }}
                />
            )}
        </>
    )
} 