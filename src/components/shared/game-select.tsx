import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { SelectOption } from "@/types/generic";

interface GameSelectProps {
  selectOptions: SelectOption[];
  setHomeTeam: (team: string) => void;
  setAwayTeam: (team: string) => void;
  isDateSelected: boolean;
  selectedGame: string | undefined;
  setSelectedGame: (value: string | undefined) => void;
}

export const GameSelect = ({ selectOptions, setHomeTeam, setAwayTeam, isDateSelected, selectedGame, setSelectedGame }: GameSelectProps) => {
  console.log(selectedGame);
  return (
    <Select
      value={selectedGame}
      onValueChange={(value) => {
        setSelectedGame(value);
        const [away, home] = value
          .trim()                      // remove leading/trailing whitespace
          .split("@")
          .map((team) => team.trim()); // remove whitespace around each team
        setHomeTeam(home);
        setAwayTeam(away);
      }}
    >
      <SelectTrigger disabled={!isDateSelected || selectOptions.length === 0} className="w-full">
        <SelectValue placeholder={!isDateSelected ? "Select a date first"
                                  : selectOptions.length === 0 ? "No events for this date" : "Select a game"}
        />
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