"use client";

import { 
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScoreCard } from "./team-score";
import { MapPin } from "lucide-react";

import { Game } from "@/types/game";

interface GameCardsProps {
    gamesData: Game[]
}

export function GameCards({gamesData} : GameCardsProps) {
    const logoDimensions: number = 64;
    const iconDimensions: number = 18;

    return (
        <>
            {gamesData.map((game, index) => (
                <Card key={index}>
                    <CardHeader className="font-semibold text-center">
                        <CardTitle>
                            {new Date(game.game_date).toLocaleDateString('en-US', {
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
                                logoFirst={true} />
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
                                logoFirst={false} />
                         </div>
                     </CardContent>
                     <CardFooter className="font-light text-sm flex justify-center">
                        <span>
                            { /* TODO: do this more elegantly */ }
                            View <a 
                                href={`${game.game_center_link.includes('espn') ? '' : 'https://nhl.com'}${game.game_center_link}`}
                                target="_blank" rel="noopener noreferrer" 
                                className="text-blue-600 hover:text-blue-800 underline">game recap</a>
                        </span>
                     </CardFooter>
                </Card>
            ))}
        </>
    )
} 