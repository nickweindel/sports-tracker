"use client";

import { useEffect, useState } from "react";

import { ArenaVisits } from "@/components/shared/arena-visits";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { GameCards } from "@/components/shared/game-card";
import { NoGamesMessage } from "@/components/shared/no-data";
import { PageHeader } from "@/components/shared/page-header";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GameSelect } from "@/components/shared/game-select";
import { TeamRecords } from "@/components/shared/team-records";
import { SportSelect } from "@/components/shared/sport-select";
import { Skeleton } from "@/components/ui/skeleton";
import { VisitKpi } from "@/components/shared/visit-kpi";

import { Arena } from "@/types/arena"
import { Game } from "@/types/game";
import { SelectOption } from "@/types/generic";
import { League } from "@/types/league";
import { LinkType } from "@/types/link";
import { TeamRecord, TeamType } from "@/types/team";

import { LEAGUE_TO_SPORT_MAPPING } from "@/lib/constants";
import { LEAGUE_TO_VENUE_TYPE_MAPPING } from "@/lib/constants";

export default function PageClient({ user }: { user: any }) {
  const [selectedLeague, setSelectedLeague] = useState<string>("mlb");
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [inputHomeTeam, setHomeTeam] = useState<string>("");
  const [inputAwayTeam, setAwayTeam] = useState<string>("");
  const [games, setGames] = useState<Game[]>([]);
  const [records, setRecords] = useState<TeamRecord[]>([]);
  const [arenas, setArenas] = useState<Arena[]>([]);
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);
  
  // Loading state variables.
  const [isGamesLoading, setIsGamesLoading] = useState<boolean>(true);
  const [isTeamRecordsLoading, setIsTeamRecordsLoading] = useState<boolean>(true);
  const [isArenasLoading, setIsArenasLoading] = useState<boolean>(true);

  // Constant to see if we've seen any games.
  const haveSeenGamesForLeague = games.length > 0;

  // Decide if we're calling the venues stadiums or arenas.
  const venueType = LEAGUE_TO_VENUE_TYPE_MAPPING[selectedLeague as League]

  // Function to handle changing the league.
  const handleLeagueChange = (value: string) => {
    setSelectedLeague(value);
    setDate(undefined);
    setHomeTeam("");
    setAwayTeam("");
  }

  // Handle selecting a date -- set the date and fetch events for that date.
  const handleSelect = async(selectedDate: Date | undefined) => {
    const date = selectedDate;
    const formattedDate = selectedDate?.toISOString().split("T")[0].replace(/-/g, "");  

    setDate(date);
    setOpen(false);

    const sport = LEAGUE_TO_SPORT_MAPPING[selectedLeague as League];

    const eventData = await fetch(`api/${sport}/${selectedLeague}/events?date=${formattedDate}`);

    if (eventData.ok) {
      const data = await eventData.json();
      setSelectOptions(data.options);
    }
  }

  // Function to fetch all games from the database
  const fetchGames = async () => {
    try {
      setIsGamesLoading(true);
      const response = await fetch(`/api/games?user=${user}&league=${selectedLeague}`);
      const data = await response.json();
      if (response.ok) {
        const gameData = data.games;
        setGames(gameData);
      } else {
        console.error('Error fetching games:', data.error);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setIsGamesLoading(false);
    }
  };

  // Fetch games on page load
  useEffect(() => {
    fetchGames()
  }, [selectedLeague]);

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
      setIsTeamRecordsLoading(true);
      const response = await fetch(`/api/teams?user=${user}&league=${selectedLeague}`);
      const data = await response.json();
      if (response.ok) {
        const teamRecordData = data.teamRecords
        setRecords(teamRecordData);
      } else {
        console.error('Error fetching games:', data.error);
      } 
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setIsTeamRecordsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamRecords()
  }, [games, selectedLeague]);

  // Function to fetch all arena visits from the database.
  const fetchArenas = async() => {
    try {
      setIsArenasLoading(true);
      const response = await fetch(`/api/arenas?user=${user}&league=${selectedLeague}`);
      const data = await response.json();
      if (response.ok) {
        const arenaData = data.arenas;
        setArenas(arenaData);
      } else {
        console.error('Error fetching arenas:', data.error);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setIsArenasLoading(false);
    }
  }

  useEffect(() => {
    fetchArenas()
  }, [games, selectedLeague]);

  // Handle delete.
  const handleDelete = async (game: Game) => {
      try {
        // Send DELETE request to the API
        const response = await fetch('/api/games', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(game),
        });

        if (response.ok) {
          fetchGames();
        } else {
          const errorData = await response.json();
          console.error('Failed to delete game:', errorData);
          alert(errorData.error || 'Failed to delete game');
        }
      } catch (error) {
        console.error('Error deleting game:', error);
        alert('An error occurred while deleting the game');
      }
  };

  const submitGame = () => {
    // TODO: there has to be a better way to abstract this, especially when we continue to add leagues
    const formattedDate = date ? date.toISOString().split('T')[0] : undefined;
    const apiDate = date ? date.toISOString().split('T')[0].replace(/-/g, '') : undefined;

    const sport = LEAGUE_TO_SPORT_MAPPING[selectedLeague as League];
    
    fetch(`/api/${sport}/${selectedLeague}?date=${apiDate}`)
      .then(response => response.json())
      .then(data => {
        let filteredGame;

        filteredGame = data.events.filter((event: any) =>
            event.shortName.toLowerCase().includes(inputAwayTeam.toLowerCase()) &&
            event.shortName.toLowerCase().includes(inputHomeTeam.toLowerCase()));

        // TODO: handle 
        if (filteredGame.length === 0) {
          window.alert(`No game on ${formattedDate} between ${inputHomeTeam} and ${inputAwayTeam}`);
          return;
        }
        
        const gameId = filteredGame[0].id;
        const gameData = filteredGame[0].competitions[0];
        const homeTeamData = gameData.competitors.find((team: TeamType) => team.homeAway === "home");
        const awayTeamData = gameData.competitors.find((team: TeamType) => team.homeAway === "away"); 

        // Check that we have the home and away teams correct.
        const homeTeamAbbreviation = homeTeamData.team.abbreviation;
        const awayTeamAbbreviation = awayTeamData.team.abbreviation;

        if (homeTeamAbbreviation !== inputHomeTeam || awayTeamAbbreviation !== inputAwayTeam) {
          window.alert(`Home and away teams are backwards. The home team is ${inputAwayTeam} and the away team is ${inputHomeTeam}`);
          return;
        }

        // Home team info.
        const homeTeamName = homeTeamData.team.name;
        const homeTeamScore = homeTeamData.score;
        const homeTeamLogo = homeTeamData.team.logo;
        const homeTeamRank = homeTeamData.curatedRank?.current ?? null;

        // Away team info.
        const awayTeamName = awayTeamData.team.name;
        const awayTeamScore = awayTeamData.score;
        const awayTeamLogo = awayTeamData.team.logo;
        const awayTeamRank = awayTeamData.curatedRank?.current ?? null;

        // Recap/box score link.
        const recapLink = filteredGame[0].links.find((link: LinkType) => link.text === "Recap")?.href
          || filteredGame[0].links.find((link: LinkType) => link.text === "Box Score")?.href;

        // Venue info.
        const neutralSite = gameData.neutralSite;
        const venueData = gameData.venue;
        const venue = venueData.fullName;

        const venueLocation = venueData.address;
        const venueCity = venueLocation.city;
        const venueState = venueLocation.state;
        const venueCountry = venueLocation.country;

        if (formattedDate && inputHomeTeam && inputAwayTeam) {
          const gameToLoad: Game = {
            user_email: user,
            game_id: gameId,
            league: selectedLeague,
            game_date: formattedDate,
            home_team: inputHomeTeam,
            home_team_name: homeTeamName,
            home_team_score: homeTeamScore,
            home_team_logo: homeTeamLogo,
            home_team_rank: homeTeamRank,
            away_team: inputAwayTeam,
            away_team_name: awayTeamName,
            away_team_score: awayTeamScore,
            away_team_logo: awayTeamLogo,
            away_team_rank: awayTeamRank,
            game_center_link: recapLink,
            arena: venue,
            arena_city: venueCity,
            arena_state: venueState,
            arena_country: venueCountry,
            neutral_site: neutralSite,
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
    <div>
      <PageHeader user={user} />
      <div className="flex flex-row gap-3 p-3">
        <div className="flex flex-col gap-3 p-3 w-70">
          <SportSelect onChange={handleLeagueChange} />
          <hr className="my-4 border-gray-300" />
          <VisitKpi seenAttribute="Games" numberSeen={distinctGames} isLoading={isGamesLoading} />
          <VisitKpi seenAttribute="Teams" numberSeen={distinctTeams} isLoading={isGamesLoading} />
          <VisitKpi seenAttribute={String(venueType)} numberSeen={distinctArenas} isLoading={isGamesLoading} />
          <hr className="my-4 border-gray-300" />
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
                  handleSelect(date);
                }}
              />
            </PopoverContent>
          </Popover>
          <GameSelect selectOptions={selectOptions} setHomeTeam={setHomeTeam} setAwayTeam={setAwayTeam} isDateSelected={date !== undefined} />
          <Button onClick={submitGame} disabled={!date || !inputHomeTeam || !inputAwayTeam}>Submit Game</Button>
        </div>
        <div className="flex flex-col gap-3 w-150">
          {isTeamRecordsLoading ? 
            <Skeleton className="w-full h-full" />
          : haveSeenGamesForLeague ? 
          (
            <GameCards gamesData={games} onDelete={handleDelete} />
          ) : (
              <NoGamesMessage infoText="No game log data for this league" />
          )}
        </div>
        <div className="w-100">
          {isTeamRecordsLoading ? 
            <Skeleton className="w-full h-full" />
          : haveSeenGamesForLeague ? 
          (
            <TeamRecords recordsData={records} /> 
          ) : (
            <NoGamesMessage infoText="No team record data for this league" />
          )}
        </div>
        <div className="w-100">
          {isArenasLoading ?
            <Skeleton className="w-full h-full" />
          : haveSeenGamesForLeague ? 
          ( 
            <ArenaVisits arenasData={arenas} venueType={String(venueType)} />
          ) : (
            <NoGamesMessage infoText={`No ${String(venueType).toLowerCase()} visit data for this league`} />
          )}
        </div>
      </div>
    </div>
  );
}