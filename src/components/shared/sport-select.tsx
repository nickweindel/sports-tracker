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
  const leagues = [
    {
      value: 'nhl',
      label: 'NHL',
      imageSrc: '/nhl.png',
    },
  ]

  return (
    <Select defaultValue="nhl" onValueChange={onChange}>
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