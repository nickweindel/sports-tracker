export interface TeamRecord {
    league: string;
    team: string;
    team_logo: string;
    home_team_wins: number;
    home_team_losses: number;
    home_team_ties: number;
    away_team_wins: number;
    away_team_losses: number;
    away_team_ties: number;
    neutral_wins: number;
    neutral_losses: number;
    neutral_ties: number;
    overall_wins: number;
    overall_losses: number;
    overall_ties: number;
}

export interface TeamType {
    homeAway: "home" | "away" | "neutral";
}