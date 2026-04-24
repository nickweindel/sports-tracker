"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NoGamesMessage } from "@/components/shared/no-data";

import {
  LEAGUE_TIES_ALLOWED,
  LEAGUE_TO_SCORE_TYPE_MAPPING,
} from "@/lib/constants";

import { TeamRecord } from "@/types/team";

import numeral from "numeral";

interface TeamRecordProps {
  recordsData: TeamRecord[];
  selectedTeam?: string;
  onTeamSelect: (team?: string) => void;
}

export function TeamRecords({
  recordsData,
  selectedTeam,
  onTeamSelect,
}: TeamRecordProps) {
  const logoDimensions = 24;

  const [recordDimension, setRecordDimension] = useState<string>("overall");

  const onSelectChange = (value: string) => {
    setRecordDimension(value);
  };

  // Calculate winning percentage and sort teams
  const sortedTeams = recordsData
    .filter((team) => {
      const wins = team[
        `${recordDimension}_wins` as keyof TeamRecord
      ] as number;
      const losses = team[
        `${recordDimension}_losses` as keyof TeamRecord
      ] as number;
      const ties = team[
        `${recordDimension}_ties` as keyof TeamRecord
      ] as number;
      return wins + losses + ties > 0; // Only include teams that have played games
    })
    .map((team) => {
      const wins = team[
        `${recordDimension}_wins` as keyof TeamRecord
      ] as number;
      const losses = team[
        `${recordDimension}_losses` as keyof TeamRecord
      ] as number;
      const ties = team[
        `${recordDimension}_ties` as keyof TeamRecord
      ] as number;
      const winningPercentage =
        ((Number(wins) + Number(ties) * 0.5) /
          (Number(wins) + Number(losses) + Number(ties))) *
        10;

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

      const dimensionWinsKey = `${recordDimension}_wins` as keyof TeamRecord;
      const dimensionLossesKey =
        `${recordDimension}_losses` as keyof TeamRecord;
      const dimensionPointDifferentialKey =
        `${recordDimension}_team_point_differential` as keyof TeamRecord;
      const dimensionPointsForKey =
        `${recordDimension}_team_points_for` as keyof TeamRecord;
      const dimensionPointsAgainstKey =
        `${recordDimension}_team_points_against` as keyof TeamRecord;

      const aDimensionWins = Number(a[dimensionWinsKey]);
      const bDimensionWins = Number(b[dimensionWinsKey]);
      const aDimensionLosses = Number(a[dimensionLossesKey]);
      const bDimensionLosses = Number(b[dimensionLossesKey]);
      const aDimensionPointDifferential = Number(
        a[dimensionPointDifferentialKey],
      );
      const bDimensionPointDifferential = Number(
        b[dimensionPointDifferentialKey],
      );
      const aDimensionPointsFor = Number(a[dimensionPointsForKey]);
      const bDimensionPointsFor = Number(b[dimensionPointsForKey]);
      const aDimensionPointsAgainst = Number(a[dimensionPointsAgainstKey]);
      const bDimensionPointsAgainst = Number(b[dimensionPointsAgainstKey]);

      if (bDimensionWins !== aDimensionWins) {
        return bDimensionWins - aDimensionWins; // secondary sort
      }

      if (aDimensionLosses !== bDimensionLosses) {
        return aDimensionLosses - bDimensionLosses; // tertiary sort
      }

      if (bDimensionPointDifferential !== aDimensionPointDifferential) {
        return bDimensionPointDifferential - aDimensionPointDifferential; // quaternary sort
      }

      if (bDimensionPointsFor !== aDimensionPointsFor) {
        return bDimensionPointsFor - aDimensionPointsFor; // quinary sort
      }

      return aDimensionPointsAgainst - bDimensionPointsAgainst; // senary sort
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
            Team Records -{" "}
            {recordDimension.charAt(0).toUpperCase() + recordDimension.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedTeams.length > 0 ? (
              <>
                {sortedTeams.map((team) => {
                  const wins = team[
                    `${recordDimension}_wins` as keyof TeamRecord
                  ] as number;
                  const losses = team[
                    `${recordDimension}_losses` as keyof TeamRecord
                  ] as number;
                  const ties = team[
                    `${recordDimension}_ties` as keyof TeamRecord
                  ] as number;
                  const totalGames = wins + losses + ties;
                  const winningPercentage = team.winningPercentage;
                  const formattedWinningPercentage = numeral(
                    winningPercentage / 10,
                  ).format("0.000");
                  const isTiesAllowed = LEAGUE_TIES_ALLOWED[team.league];
                  const scoreType =
                    LEAGUE_TO_SCORE_TYPE_MAPPING[
                      team.league as keyof typeof LEAGUE_TO_SCORE_TYPE_MAPPING
                    ] ?? "points";
                  const metricPrefix = `${recordDimension}_team`;
                  const pointsFor = Number(
                    team[
                      `${metricPrefix}_points_for` as keyof TeamRecord
                    ] as number,
                  );
                  const pointsAgainst = Number(
                    team[
                      `${metricPrefix}_points_against` as keyof TeamRecord
                    ] as number,
                  );
                  const pointDifferential = Number(
                    team[
                      `${metricPrefix}_point_differential` as keyof TeamRecord
                    ] as number,
                  );
                  const differentialClassName =
                    pointDifferential > 0
                      ? "text-green-600"
                      : pointDifferential < 0
                        ? "text-red-600"
                        : "text-muted-foreground";
                  const scoreTypeText = String(scoreType);
                  const scoreTypeLabel =
                    scoreTypeText.charAt(0).toUpperCase() +
                    scoreTypeText.slice(1);
                  const formattedDifferential = `${
                    pointDifferential > 0 ? "+" : ""
                  }${pointDifferential}`;
                  const formattedPointsFor = numeral(pointsFor).format("0,0");
                  const formattedPointsAgainst =
                    numeral(pointsAgainst).format("0,0");
                  const formattedPointsPerGame = numeral(pointsFor / totalGames).format("0,0.00");
                  const formattedPointsAgainstPerGame = numeral(pointsAgainst / totalGames).format("0,0.00");
                  const formattedPointDifferentialPerGame = numeral(pointDifferential / totalGames).format("0,0.00");

                  // Conditional logic to see if we should highlight a team's card.
                  const isSelected = selectedTeam === team.team;

                  return (
                    <Card
                      key={team.team}
                      className={`
                          cursor-pointer transition-colors
                          ${isSelected ? "bg-primary/5" : "hover:bg-muted"}
                      `}
                      onClick={() =>
                        onTeamSelect(isSelected ? undefined : team.team)
                      }
                    >
                      <CardContent className="flex items-center justify-between m-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={team.team_logo}
                            width={logoDimensions}
                            height={logoDimensions}
                          />
                          <span className="font-medium">{team.team}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span>
                            {Number(wins)}W - {Number(losses)}L
                            {isTiesAllowed && ` - ${Number(ties)}T`}
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className={`font-semibold ${differentialClassName}`}
                              >
                                {formattedDifferential}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              sideOffset={6}
                              className="min-w-[220px] space-y-1.5 px-3 py-2"
                            >
                              <div className="flex w-full items-baseline justify-between gap-6">
                                <span className="shrink-0 text-left">
                                  {scoreTypeLabel} For:
                                </span>
                                <span className="text-right tabular-nums whitespace-nowrap">
                                  {`${formattedPointsFor} (${formattedPointsPerGame})`}
                                </span>
                              </div>
                              <div className="flex w-full items-baseline justify-between gap-6">
                                <span className="shrink-0 text-left">
                                  {scoreTypeLabel} Against:
                                </span>
                                <span className="text-right tabular-nums whitespace-nowrap">
                                  {`${formattedPointsAgainst} (${formattedPointsAgainstPerGame})`}
                                </span>
                              </div>
                              <div className="flex w-full items-baseline justify-between gap-6">
                                <span className="shrink-0 text-left">
                                  {scoreTypeLabel} Differential:
                                </span>
                                <span className="text-right tabular-nums whitespace-nowrap">
                                  {`${formattedDifferential} (${formattedPointDifferentialPerGame})`}
                                </span>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                          <span className="font-bold">
                            {formattedWinningPercentage}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </>
            ) : (
              <>
                <NoGamesMessage
                  infoText=""
                  noGameTypeRecord={recordDimension}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
