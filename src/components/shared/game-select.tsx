import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { SelectOption } from "@/types/generic";

interface TeamInputProps {
  selectOptions: SelectOption[];
  setHomeTeam: (team: string) => void;
  setAwayTeam: (team: string) => void;
}

export const GameSelect = ({ selectOptions, setHomeTeam, setAwayTeam }: TeamInputProps) => {

  return (
    <>
      <Input type="text" placeholder={placeholder} maxLength={4} onChange={(e) => setTeam(e.target.value)} />
    </>
  )
}