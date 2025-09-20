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

import { TeamRecord } from "@/types/team-record";
import numeral from "numeral";

interface TeamRecordProps {
    recordsData: TeamRecord[]
}

export function TeamRecords({recordsData} : TeamRecordProps) {
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
            return wins + losses > 0; // Only include teams that have played games
        })
        .map(team => {
            const wins = team[`${recordDimension}_wins` as keyof TeamRecord] as number;
            const losses = team[`${recordDimension}_losses` as keyof TeamRecord] as number;
            const winningPercentage = (Number(wins) / (Number(wins) + Number(losses))) * 10;
            
            return {
                ...team,
                winningPercentage
            };
        })
        .sort((a, b) => b.winningPercentage - a.winningPercentage);

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
                        {sortedTeams.map((team) => {
                            const wins = team[`${recordDimension}_wins` as keyof TeamRecord] as number;
                            const losses = team[`${recordDimension}_losses` as keyof TeamRecord] as number;
                            const winningPercentage = team.winningPercentage;
                            const formattedWinningPercentage = numeral(winningPercentage / 10).format('0.000');
                            console.log(team);
                            console.log(wins);
                            console.log(losses);
                            
                            return (
                                <Card key={team.team}>
                                    <CardContent className="flex items-center justify-between m-2">
                                        <div className="flex items-center gap-2">
                                            <img 
                                                src={team.team_logo} 
                                                width={logoDimensions} 
                                                height={logoDimensions} />
                                            <span className="font-medium">{team.team}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span>{Number(wins)}W - {Number(losses)}L</span>
                                            <span className="font-bold">
                                                {formattedWinningPercentage}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}