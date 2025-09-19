interface ScoreCardProps {
    score: number; 
    logoSrc: string;
    logoDimensions: number;
    logoFirst: boolean; // Optional prop to reverse order
}

export function ScoreCard({ score, logoSrc, logoDimensions, logoFirst }: ScoreCardProps) {
    const textClass = "text-2xl font-bold"
    const marginClass = "ml-2"

    return (
        <div className="flex flex-row items-center">
            {logoFirst ? (
                <>
                    <img className={marginClass} width={logoDimensions} height={logoDimensions} src={logoSrc} />
                    <div className={textClass}>
                        {score}
                    </div>
                </>
            ) : (
                <>
                    <div className={`${textClass} ${marginClass}`}>
                        {score}
                    </div>
                    <img width={logoDimensions} height={logoDimensions} src={logoSrc} />
                </>
            )}
        </div>
    )
}