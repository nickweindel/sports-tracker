import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { X } from "lucide-react";

interface ActiveFilterChipProps {
  label: string;
  value: string;
  onClear: () => void;
}

export function ActiveFilterChip({
  label,
  value,
  onClear,
}: ActiveFilterChipProps) {
  return (
    <div>
        <Badge
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
        >
            <span className="text-xs text-muted-foreground">
                {label}:
            </span>
            <span className="font-medium truncate">{value}</span>

            <div className="ml-auto">
              <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 cursor-pointer"
                  onClick={onClear}
                  aria-label={`Clear ${label} filter`}
              >
                  <X className="h-3 w-3" />
              </Button>
            </div>
        </Badge>
    </div>
  );
}
