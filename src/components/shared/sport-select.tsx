"use client";

import { Info } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SportSelectProps {
  value?: string;
  onChange: (value: string) => void;
}

interface LeagueOption {
  value: string;
  label: string;
  imageSrc: string;
  note?: string;
}

export function SportSelect({ value, onChange }: SportSelectProps) {
  const publicSubDirectory = "league-logos";
  const basketballSubDirectory = "basketball";
  const soccerSubDirectory = "soccer";
  const ncaaPath = `/${publicSubDirectory}/ncaa.png`;

  const leagues: LeagueOption[] = [
    {
      value: "mlb",
      label: "MLB",
      imageSrc: `/${publicSubDirectory}/mlb.png`,
    },
    {
      value: "college-baseball",
      label: "College Baseball",
      imageSrc: ncaaPath,
      note: "Unreliable ranking information prior to 2022",
    },
    {
      value: "nhl",
      label: "NHL",
      imageSrc: `/${publicSubDirectory}/nhl.png`,
    },
    //{
    //  value: "mens-college-hockey",
    //  label: "Men's College Hockey",
    //  imageSrc: ncaaPath
    //},
    //{
    //  value: "womens-college-hockey",
    //  label: "Women's College Hockey",
    //  imageSrc: ncaaPath,
    //},
    {
      value: "nfl",
      label: "NFL",
      imageSrc: `/${publicSubDirectory}/nfl.png`,
    },
    {
      value: "college-football",
      label: "College Football",
      imageSrc: ncaaPath,
    },
    {
      value: "nba",
      label: "NBA",
      imageSrc: `/${publicSubDirectory}/${basketballSubDirectory}/nba.png`,
    },
    {
      value: "wnba",
      label: "WNBA",
      imageSrc: `/${publicSubDirectory}/${basketballSubDirectory}/wnba.png`,
    },
    {
      value: "mens-college-basketball",
      label: "Men's College Basketball",
      imageSrc: ncaaPath,
    },
    {
      value: "womens-college-basketball",
      label: "Women's College Basketball",
      imageSrc: ncaaPath,
    },
    {
      value: "fifa.world",
      label: "FIFA World Cup",
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/fifa.png`,
    },
    {
      value: "arg.1",
      label: "Argentine Primera División",
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/arg.png`,
    },
    {
      value: "bra.1",
      label: "Brazilian Série A",
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/bra.png`,
    },
    {
      value: "eng.1",
      label: "EPL",
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/eng.png`,
    },
    {
      value: "esp.1",
      label: "La Liga",
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/esp.png`,
    },
    {
      value: "fra.1",
      label: "Ligue 1",
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/fra.png`,
    },
    {
      value: "ger.1",
      label: "Bundesliga",
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/ger.png`,
    },
    {
      value: "ita.1",
      label: "Serie A",
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/ita.png`,
    },
    {
      value: "mex.1",
      label: "Liga MX",
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/mex.png`,
    },
    {
      value: "ned.1",
      label: "Eredivisie",
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/ned.png`,
    },
    {
      value: "por.1",
      label: "Primeira Liga",
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/por.png`,
    },
    {
      value: "usa.1",
      label: "MLS",
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/usa.png`,
    },
    {
      value: "mens-college-volleyball",
      label: "Men's College Volleyball",
      imageSrc: ncaaPath,
    },
    {
      value: "womens-college-volleyball",
      label: "Women's College Volleyball",
      imageSrc: ncaaPath,
    },
  ];

  return (
    <Select value={value ?? "mlb"} onValueChange={onChange}>
      <SelectTrigger className="w-auto">
        <SelectValue placeholder="Select a league" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel></SelectLabel>
          {leagues.map((league) => (
            <SelectItem key={league.value} value={league.value}>
              <div className="flex items-center">
                <img
                  src={league.imageSrc}
                  alt={`${league.label} logo`}
                  className="mr-2 size-5"
                />
                {league.label}
                {league.note && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className="ml-1.5 inline-flex pointer-events-auto"
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Info className="size-3.5 text-muted-foreground pointer-events-auto" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      sideOffset={6}
                      className="z-[200] max-w-56"
                    >
                      {league.note}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
