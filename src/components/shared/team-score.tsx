interface ScoreCardProps {
    score: number; 
    logoSrc: string;
    logoDimensions: number;
}

export function ScoreCard({ score, logoSrc, logoDimensions }: ScoreCardProps) {
    return (
        <div className="flex flex-row items-center">
            <img width={logoDimensions} height={logoDimensions} src={logoSrc} />
            <div className="text-2xl font-bold ml-2">
                {score}
            </div>
        </div>
    )
}