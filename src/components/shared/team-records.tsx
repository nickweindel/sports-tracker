"use client";

import { useState } from "react";

import { 
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { NoGamesMessage } from "@/components/shared/no-data";

import { LEAGUE_TIES_ALLOWED } from "@/lib/constants";

import { TeamRecord } from "@/types/team";

import numeral from "numeral";

interface TeamRecordProps {
    recordsData: TeamRecord[];
    selectedTeam?: string;
    onTeamSelect: (team?: string) => void;
}

export function TeamRecords({recordsData, selectedTeam, onTeamSelect} : TeamRecordProps) {
    const logoDimensions = 24;

    const [recordDimension, setRecordDimension] = useState<string>("overall");

    const onSelectChange = (value: string) => {
        setRecordDimension(value);
    }

    // Calculate winning percentage and sort teams
    const sortedTeams = recordsData
        .filter(team => {
            const wins = team[`${recordDimension}_wins` as keyof TeamRecord] as number;
            const losses = team[`${recordDimension}_losses` as keyof TeamRecord] as number;
            const ties = team[`${recordDimension}_ties` as keyof TeamRecord] as number;
            return wins + losses + ties > 0; // Only include teams that have played games
        })
        .map(team => {
            const wins = team[`${recordDimension}_wins` as keyof TeamRecord] as number;
            const losses = team[`${recordDimension}_losses` as keyof TeamRecord] as number;
            const ties = team[`${recordDimension}_ties` as keyof TeamRecord] as number;
            const winningPercentage = ((Number(wins) +(Number(ties) * 0.5)) / (Number(wins) + Number(losses) + Number(ties))) * 10;
            
            return {
                ...team,
                winningPercentage,
                wins,
                losses,
            };
        })
        .sort((a, b) => {
            if (b.winningPercentage !== a.winningPercentage) {
              return b.winningPercentage - a.winningPercentage; // primary sort
            }

            if (b.wins !== a.wins) {
                return b.wins - a.wins // secondary sort
            }
            return a.losses - b.losses; // tertiary sort
          });

    return (
        <div className="flex flex-col gap-3">
            <Select defaultValue="overall" onValueChange={onSelectChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="overall">Overall</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="away">Away</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
            </Select>
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">
                        Team Records - {recordDimension.charAt(0).toUpperCase() + recordDimension.slice(1)}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {sortedTeams.length > 0 ? (
                            <>
                                {sortedTeams.map((team) => {
                                    const wins = team[`${recordDimension}_wins` as keyof TeamRecord] as number;
                                    const losses = team[`${recordDimension}_losses` as keyof TeamRecord] as number;
                                    const ties = team[`${recordDimension}_ties` as keyof TeamRecord] as number;
                                    const winningPercentage = team.winningPercentage;
                                    const formattedWinningPercentage = numeral(winningPercentage / 10).format('0.000');
                                    const isTiesAllowed = LEAGUE_TIES_ALLOWED[team.league];

                                    // Conditional logic to see if we should highlight a team's card.
                                    const isSelected = selectedTeam === team.team;
                                    
                                    return (
                                        <Card 
                                            key={team.team}   
                                            className={`
                                                cursor-pointer transition-colors
                                                ${isSelected ? "bg-primary/5" : "hover:bg-muted"}
                                            `} 
                                            onClick={() => onTeamSelect(isSelected ? undefined : team.team)}>
                                            <CardContent className="flex items-center justify-between m-2">
                                                <div className="flex items-center gap-2">
                                                    <img 
                                                        src={team.team_logo} 
                                                        width={logoDimensions} 
                                                        height={logoDimensions} />
                                                    <span className="font-medium">{team.team}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span>
                                                        {Number(wins)}W - {Number(losses)}L
                                                        {isTiesAllowed && ` - ${Number(ties)}T`}
                                                    </span>
                                                    <span className="font-bold">
                                                        {formattedWinningPercentage}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </>
                            ) :
                            (
                                <>
                                    <NoGamesMessage infoText="" noGameTypeRecord={recordDimension} /> 
                                </>
                            )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}