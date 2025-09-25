import { Input } from "@/components/ui/input";

interface TeamInputProps {
  homeOrAway: string
  setTeam: (team: string) => void
}

export const TeamInput = ({ homeOrAway, setTeam }: TeamInputProps) => {
  const placeholder = `Enter ${homeOrAway} Team Abbreviation`

  return (
    <>
      <Input type="text" placeholder={placeholder} maxLength={4} onChange={(e) => setTeam(e.target.value)} />
    </>
  )
}