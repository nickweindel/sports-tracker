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
  return (
    <Select defaultValue="nhl" onValueChange={onChange}>
      <SelectTrigger className="w-auto">
        <SelectValue placeholder="Select a league" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel></SelectLabel>
          <SelectItem value="nhl">NHL</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}