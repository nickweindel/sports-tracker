import { 
    Card,
    CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface VisitKpiProps {
    seenAttribute: string; 
    numberSeen: number;
    isLoading: boolean;
}

export function VisitKpi({seenAttribute, numberSeen, isLoading} : VisitKpiProps) {
    return (
        <Card className="p-3">
            <CardContent className="flex flex-row justify-between">
                <div className="font-semibold">
                    {seenAttribute}
                </div>
                {isLoading ? 
                    <Skeleton className="w-[30px]" />
                : (
                    <div className="font-bold">
                        {numberSeen > 0 ? numberSeen: "-"}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}