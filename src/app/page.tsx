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
import { SportSelect } from "@/components/shared/sport-select";
import { VisitKpi } from "@/components/shared/visit-kpi";

import { Arena } from "@/types/arena"
import { Game } from "@/types/game";
import { TeamRecord } from "@/types/team-record";

export default function Home() {
  const [selectedLeague, setSelectedLeague] = useState<string>("nhl");
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [inputHomeTeam, setHomeTeam] = useState<string>("");
  const [inputAwayTeam, setAwayTeam] = useState<string>("");
  const [games, setGames] = useState<Game[]>([]);
  const [records, setRecords] = useState<TeamRecord[]>([]);
  const [arenas, setArenas] = useState<Arena[]>([]);

  // Function to handle changing the league.
  const handleLeagueChange = (value: string) => {
    setSelectedLeague(value)
  }

  // Function to fetch all games from the database
  const fetchGames = async () => {
    try {
      const response = await fetch(`/api/games?league=${selectedLeague}`);
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
  }, [selectedLeague])

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
      const response = await fetch(`/api/teams?league=${selectedLeague}`);
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
  }, [games, selectedLeague]);

  // Function to fetch all arena visits from the database.
  const fetchArenas = async() => {
    try {
      const response = await fetch(`/api/arenas?league=${selectedLeague}`);
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
  }, [games, selectedLeague]);

  const submitGame = () => {
    // TODO: there has to be a better way to abstract this, especially when we continue to add leagues
    const formattedDate = date ? date.toISOString().split('T')[0] : undefined
    let apiDate: string | undefined;

    if (date) {
      if (selectedLeague === 'cfb') {
        // Format: 20250912
        apiDate = date.toISOString().split('T')[0].replace(/-/g, '');
      } else if (selectedLeague === 'nhl') {
        // Format: 2025-09-12
        apiDate = date.toISOString().split('T')[0];
      } else {
        // Default format if needed
        apiDate = date.toISOString().split('T')[0];
      }
    } else {
      apiDate = undefined;
    }
    
    fetch(`/api/${selectedLeague}?date=${apiDate}`)
      .then(response => response.json())
      .then(data => {
        let filteredGame;

        if (selectedLeague === "nhl") {
          filteredGame = data.games.filter((game: any) => 
            game.awayTeam.abbrev === inputAwayTeam && game.homeTeam.abbrev === inputHomeTeam
          );
        } else {
          filteredGame = data.events.filter((event: any) =>
            event.shortName.toLowerCase().includes(inputAwayTeam.toLowerCase()) &&
            event.shortName.toLowerCase().includes(inputHomeTeam.toLowerCase())
          );
        }
        
        // TODO: introduce better error handling
        const gameData = selectedLeague === "nhl" ? filteredGame[0] : filteredGame[0].competitions[0];
        const homeTeamData = selectedLeague === "nhl" ? gameData.homeTeam : gameData.competitors.find(team => team.homeAway === "home"); // TODO: fix typing
        const awayTeamData = selectedLeague === "nhl" ? gameData.awayTeam : gameData.competitors.find(team => team.homeAway === "away"); // TODO: fix typing

        // Set the remaining items to upload.
        const homeTeamName = selectedLeague === "nhl" ? homeTeamData.name.default : homeTeamData.team.name;
        const homeTeamScore = homeTeamData.score;
        const homeTeamLogo = selectedLeague === "nhl" ? homeTeamData.logo : homeTeamData.team.logo;
        const awayTeamName = selectedLeague === "nhl" ? awayTeamData.name.default : awayTeamData.team.name;
        const awayTeamScore = awayTeamData.score;
        const awayTeamLogo = selectedLeague === "nhl" ? awayTeamData.logo : awayTeamData.team.logo;
        const recapLink = selectedLeague === "nhl" ? gameData.gameCenterLink : filteredGame[0].links.find(link => link.text === "Recap").href; // TODO: handle instances without a recap
        const venue = selectedLeague === "nhl" ? gameData.venue.default : gameData.venue.fullName;

        if (formattedDate && inputHomeTeam && inputAwayTeam) {
          const gameToLoad: Game = {
            league: selectedLeague,
            game_date: formattedDate,
            home_team: inputHomeTeam,
            home_team_name: homeTeamName,
            home_team_score: homeTeamScore,
            home_team_logo: homeTeamLogo,
            away_team: inputAwayTeam,
            away_team_name: awayTeamName,
            away_team_score: awayTeamScore,
            away_team_logo: awayTeamLogo,
            game_center_link: recapLink,
            arena: venue
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
        <SportSelect onChange={handleLeagueChange} />
        <hr className="my-4 border-gray-300" />
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
