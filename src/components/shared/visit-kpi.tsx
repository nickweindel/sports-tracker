import { 
    Card,
    CardContent,
} from "@/components/ui/card";

interface VisitKpiProps {
    seenAttribute: string; 
    numberSeen: number;
}

export function VisitKpi({seenAttribute, numberSeen} : VisitKpiProps) {
    return (
        <Card className="p-3">
            <CardContent className="flex flex-row justify-between">
                <div className="font-semibold">
                    {seenAttribute}
                </div>
                <div className="font-bold">
                    {numberSeen}
                </div>
            </CardContent>
        </Card>
    )
}