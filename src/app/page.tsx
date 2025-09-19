"use client";

import { useEffect, useState } from "react";

import { ArenaVisits } from "@/components/shared/arena-visits";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { GameCards } from "@/components/shared/game-card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TeamInput } from "@/components/shared/team-input";
import { TeamRecords } from "@/components/shared/team-records";
import { VisitKpi } from "@/components/shared/visit-kpi";

import { Arena } from "@/types/arena"
import { Game } from "@/types/game";
import { TeamRecord } from "@/types/team-record";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [inputHomeTeam, setHomeTeam] = useState<string>("");
  const [inputAwayTeam, setAwayTeam] = useState<string>("");
  const [games, setGames] = useState<Game[]>([]);
  const [records, setRecords] = useState<TeamRecord[]>([]);
  const [arenas, setArenas] = useState<Arena[]>([]);

  // Function to fetch all games from the database
  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      const data = await response.json();
      if (response.ok) {
        const gameData = data.games;
        setGames(gameData);
        console.log('Games fetched:', gameData);
      } else {
        console.error('Error fetching games:', data.error);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  // Fetch games on page load
  useEffect(() => {
    fetchGames()
  }, [])

  // Calculate distinct counts for KPIs
  const distinctGames = games.length;

  const distinctTeams = games.length > 0 ? new Set([
    ...games.map(game => game.home_team),
    ...games.map(game => game.away_team)
  ]).size : 0

  const distinctArenas = games.length > 0 ? new Set(
    games.map(game => game.arena)
  ).size : 0;

  // Function to fetch all team records from the database
  const fetchTeamRecords = async() => {
    try {
      const response = await fetch('/api/teams');
      const data = await response.json();
      if (response.ok) {
        const teamRecordData = data.teamRecords
        setRecords(teamRecordData);
        console.log('Records fetched:', teamRecordData);
      } else {
        console.error('Error fetching games:', data.error);
      } 
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  useEffect(() => {
    fetchTeamRecords()
  }, [games]);

  // Function to fetch all arena visits from the database.
  const fetchArenas = async() => {
    try {
      const response = await fetch('/api/arenas');
      const data = await response.json();
      if (response.ok) {
        const arenaData = data.arenas;
        setArenas(arenaData);
        console.log('Arenas fetched:', arenaData);
      } else {
        console.error('Error fetching arenas:', data.error);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  }

  useEffect(() => {
    fetchArenas()
  }, [games]);

  const submitGame = () => {
    const formattedDate = date ? date.toISOString().split('T')[0] : undefined;
    
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
            league: "nhl", // TODO: have this be dynamic for the league
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
             // Refetch games after successful POST
             fetchGames();
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
    <div className="flex flex-row gap-3 p-3">
      <div className="flex flex-col gap-3 p-3 w-70">
        <VisitKpi seenAttribute="Games" numberSeen={distinctGames} />
        <VisitKpi seenAttribute="Teams" numberSeen={distinctTeams}/>
        <VisitKpi seenAttribute="Arenas" numberSeen={distinctArenas}/>
        <hr className="my-4 border-gray-300" />
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
      <div className="flex flex-col gap-3 w-150">
        <GameCards gamesData={games} />
      </div>
      <div className="w-100">
        <TeamRecords recordsData={records} /> 
      </div>
      <div className="w-100">
        <ArenaVisits arenasData={arenas} />
      </div>
    </div>
  );
}
