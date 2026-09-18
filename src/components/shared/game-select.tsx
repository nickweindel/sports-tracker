"use client";

import { useMemo, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { SelectOption } from "@/types/generic";

interface GameSelectProps {
  selectOptions: SelectOption[];
  setHomeTeam: (team: string) => void;
  setAwayTeam: (team: string) => void;
  isDateSelected: boolean;
  selectedGame: string | undefined;
  setSelectedGame: (value: string | undefined) => void;
  isFetching: boolean;
  setNotes: (notes: string | null) => void;
}

function applySelectedGame(
  value: string,
  setHomeTeam: (team: string) => void,
  setAwayTeam: (team: string) => void,
  setNotes: (notes: string | null) => void,
) {
  const trimmed = value.trim();

  let away, home;

  if (trimmed.includes("@")) {
    [away, home] = trimmed.split("@").map((t) => t.trim());
  } else {
    // Neutral site games use VS instead of @
    [away, home] = trimmed.split(/vs/i).map((t) => t.trim());
  }

  setHomeTeam(home);
  setAwayTeam(away);
  setNotes(null);
}

export const GameSelect = ({
  selectOptions,
  setHomeTeam,
  setAwayTeam,
  isDateSelected,
  selectedGame,
  setSelectedGame,
  isFetching,
  setNotes,
}: GameSelectProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const disabled = !isDateSelected || selectOptions.length === 0;

  const selectedOption = selectOptions.find(
    (option) => option.value === selectedGame,
  );

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return selectOptions;
    }

    return selectOptions.filter((option) =>
      `${option.label} ${option.value}`.toLowerCase().includes(normalized),
    );
  }, [query, selectOptions]);

  const placeholder = !isDateSelected
    ? "Select a date first"
    : selectOptions.length === 0
      ? "No events for this date"
      : isFetching
        ? "Fetching games..."
        : "Select a game";

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setQuery("");
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronDownIcon className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(21.6rem,calc(100vw-1.5rem))] min-w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="border-b p-2">
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games..."
            className="h-8"
          />
        </div>
        <div className="max-h-60 overflow-y-auto p-1">
          {filteredOptions.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No matching games
            </p>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = option.value === selectedGame;
              return (
                <button
                  key={option.value}
                  type="button"
                  className="relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-left text-sm whitespace-normal outline-hidden hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    setSelectedGame(option.value);
                    applySelectedGame(
                      option.value,
                      setHomeTeam,
                      setAwayTeam,
                      setNotes,
                    );
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <span className="pr-1">{option.label}</span>
                  {isSelected && (
                    <CheckIcon className="absolute right-2 size-4" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
