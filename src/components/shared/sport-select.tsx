import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SportSelectProps {
    onChange: (value: string) => void
}

export function SportSelect({ onChange } : SportSelectProps) {
  const publicSubDirectory = "league-logos";
  const basketballSubDirectory = "basketball";
  const soccerSubDirectory = "soccer";
  const ncaaPath = `/${publicSubDirectory}/ncaa.png`;

  const leagues = [
    {
      value: 'mlb',
      label: 'MLB',
      imageSrc: `/${publicSubDirectory}/mlb.png`,
    },
    {
      value: 'nhl',
      label: 'NHL',
      imageSrc: `/${publicSubDirectory}/nhl.png`,
    },
    {
      value: 'nfl',
      label: 'NFL',
      imageSrc: `/${publicSubDirectory}/nfl.png`,
    },
    {
      value: 'college-football',
      label: 'College Football',
      imageSrc: ncaaPath,
    },
    {
      value: 'nba',
      label: 'NBA',
      imageSrc: `/${publicSubDirectory}/${basketballSubDirectory}/nba.png`,
    },
    {
      value: 'wnba',
      label: 'WNBA',
      imageSrc: `/${publicSubDirectory}/${basketballSubDirectory}/wnba.png`,
    },
    {
      value: 'mens-college-basketball',
      label: "Men's College Basketball",
      imageSrc: ncaaPath,
    },
    {
      value: 'womens-college-basketball',
      label: "Women's College Basketball",
      imageSrc: ncaaPath,
    },
    {
      value: 'arg.1',
      label: 'Argentine Primera División',
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/arg.png`,
    },
    {
      value: 'bra.1',
      label: 'Brazilian Série A',
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/bra.png`,
    },
    {
      value: 'eng.1',
      label: 'EPL',
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/eng.png`,
    },
    {
      value: 'esp.1',
      label: 'La Liga',
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/esp.png`,
    },
    {
      value: 'fra.1',
      label: 'Ligue 1',
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/fra.png`,
    },
    {
      value: 'ger.1',
      label: 'Bundesliga',
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/ger.png`,
    },
    {
      value: 'ita.1',
      label: 'Serie A',
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/ita.png`,
    },
    {
      value: 'mex.1',
      label: 'Liga MX',
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/mex.png`,
    },
    {
      value: 'ned.1',
      label: 'Eredivisie',
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/ned.png`,
    },
    {
      value: 'por.1',
      label: 'Primeira Liga',
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/por.png`,
    },
    {
      value: 'usa.1',
      label: 'MLS',
      imageSrc: `/${publicSubDirectory}/${soccerSubDirectory}/usa.png`,
    }
  ]

  return (
    <Select defaultValue="mlb" onValueChange={onChange}>
      <SelectTrigger className="w-auto">
        <SelectValue placeholder="Select a league" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel></SelectLabel>
          {leagues.map((league) => (
            <SelectItem key={league.value} value={league.value}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={league.imageSrc}
                  alt={`${league.label} logo`}
                  style={{ width: 20, height: 20, marginRight: 8 }}
                />
                {league.label}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}