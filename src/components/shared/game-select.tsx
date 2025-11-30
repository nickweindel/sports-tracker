import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { SelectOption } from "@/types/generic";

interface TeamInputProps {
  selectOptions: SelectOption[];
  setHomeTeam: (team: string) => void;
  setAwayTeam: (team: string) => void;
  isDateSelected: boolean;
}

export const GameSelect = ({ selectOptions, setHomeTeam, setAwayTeam, isDateSelected }: TeamInputProps) => {
  return (
    <Select
      onValueChange={(value) => {
        const [away, home] = value
          .trim()                // remove leading/trailing whitespace
          .split("@")
          .map((team) => team.trim()); // remove whitespace around each team
        setHomeTeam(home);
        setAwayTeam(away);
      }}
    >
      <SelectTrigger disabled={!isDateSelected} className="w-full">
        <SelectValue placeholder={isDateSelected ? "Select a game" : "Select a date"} />
      </SelectTrigger>

      <SelectContent>
        {selectOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};