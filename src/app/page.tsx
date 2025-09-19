"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TeamInput } from "@/components/shared/team-input"

import { Game } from "@/types/game"

export default function Home() {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [inputHomeTeam, setHomeTeam] = useState<string>("")
  const [inputAwayTeam, setAwayTeam] = useState<string>("")

  const submitGame = () => {
    const formattedDate = date ? date.toISOString().split('T')[0] : undefined
    
    fetch(`/api/nhl?date=${formattedDate}`)
      .then(response => response.json())
      .then(data => {
        const filteredGame = data.games.filter((game: any) => 
          game.awayTeam.abbrev === inputAwayTeam && game.homeTeam.abbrev === inputHomeTeam
        );

        // TODO: introduce better error handling
        const gameData = filteredGame[0];
        const homeTeamData = gameData.homeTeam;
        const awayTeamData = gameData.awayTeam;

        if (formattedDate && inputHomeTeam && inputAwayTeam) {
          const gameToLoad: Game = {
            game_date: formattedDate,
            home_team: inputHomeTeam,
            home_team_name: homeTeamData.name.default,
            home_team_score: homeTeamData.score,
            home_team_logo: homeTeamData.logo,
            away_team: inputAwayTeam,
            away_team_name: awayTeamData.name.default,
            away_team_score: awayTeamData.score,
            away_team_logo: awayTeamData.logo,
            game_center_link: gameData.gameCenterLink,
            arena: gameData.venue.default
          }

           // POST this to our DB
           fetch('/api/games', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify(gameToLoad),
           })
           .then(response => response.json())
           .then(data => {
             console.log('Game saved successfully:', data);
           })
           .catch(error => {
             console.error('Error saving game:', error);
           });
        } 
      })
      .catch(error => {
        console.error('Error fetching game data:', error)
      })
  }
  
  return (
    <div className="flex flex-col gap-3 p-3 w-70">
      <Label htmlFor="date" className="px-1">
        Game Date
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="justify-between font-normal"
          >
            {date ? date.toISOString().split('T')[0] : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
      <TeamInput homeOrAway="Home" setTeam={setHomeTeam} />
      <TeamInput homeOrAway="Away" setTeam={setAwayTeam} />
      <Button onClick={submitGame} disabled={!date || !inputHomeTeam || !inputAwayTeam}>Submit Game</Button>
    </div>
  );
}
