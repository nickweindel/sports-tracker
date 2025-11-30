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
  isFetching: boolean;
}

export const GameSelect = ({ 
  selectOptions, 
  setHomeTeam, 
  setAwayTeam, 
  isDateSelected, 
  selectedGame, 
  setSelectedGame, 
  isFetching }: GameSelectProps) => {
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
        <SelectValue placeholder={!isDateSelected
                                  ? "Select a date first"
                                  : selectOptions.length === 0
                                    ? "No events for this date"
                                    : isFetching
                                      ? "Fetching games..."
                                      : "Select a game"}
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