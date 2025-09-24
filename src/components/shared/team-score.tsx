import { Badge } from "@/components/ui/badge"; // Update to your path

interface ScoreCardProps {
  score: number;
  logoSrc: string;
  logoDimensions: number;
  logoFirst: boolean;
  rank: number | undefined;
}

export function ScoreCard({ score, logoSrc, logoDimensions, logoFirst, rank }: ScoreCardProps) {
  const showRank = rank && Number(rank) !== 99;

  const textClass = "text-2xl font-bold";
  const marginClass = "ml-2";

  // Determine badge position based on logoFirst
  const badgePosition = logoFirst ? "top-0 left-0" : "top-0 right-0";

  const LogoWithRank = (
    <div className="relative flex items-center">
      <img
        className={marginClass}
        width={logoDimensions}
        height={logoDimensions}
        src={logoSrc}
        alt="Team Logo"
      />
      {showRank && (
        <Badge
          className={`absolute ${badgePosition} text-xs px-1.5 py-0.5 backdrop-blur-sm`}
          variant="secondary"
        >
          #{rank}
        </Badge>
      )}
    </div>
  );

  return (
    <div className="flex flex-row items-center">
      {logoFirst ? (
        <>
          {LogoWithRank}
          <div className={textClass}>{score}</div>
        </>
      ) : (
        <>
          <div className={`${textClass} ${marginClass}`}>{score}</div>
          {LogoWithRank}
        </>
      )}
    </div>
  );
}
