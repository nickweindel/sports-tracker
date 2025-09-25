
import { 
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Arena } from "@/types/arena";

interface ArenaVisitsProps {
    arenasData: Arena[] 
    venueType: string;
}

export function ArenaVisits({ arenasData, venueType } : ArenaVisitsProps) {
    // Calculate arena visits and sort them
    const sortedArenas = arenasData.sort((a, b) => b.visits - a.visits);

    return (
        <div className="flex flex-col gap-3">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">
                        {venueType} Visited
                    </CardTitle>
                    <CardContent className="flex items-center justify-between m-2">
                        <div className="space-y-2 w-full">
                            {sortedArenas.map((arena) => {
                                return (
                                    <Card key={arena.arena}>
                                        <CardContent className="flex items-center justify-between m-2">
                                            <div className="font-medium">{arena.arena}</div>
                                            <div className="font-bold">{arena.visits}</div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </CardContent> 
                </CardHeader>
            </Card>
        </div>
    )
}

