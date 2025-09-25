export interface Game {
  user_email: string;
  game_id: number;
  league: string;
  game_date: string; // YYYY-MM-DD
  home_team: string;
  home_team_name: string;
  home_team_score: number;
  home_team_logo: string;
  home_team_rank: number;
  away_team: string;
  away_team_name: string;
  away_team_score: number;
  away_team_logo: string;
  away_team_rank: number;
  game_center_link: string;
  arena: string;
  arena_city: string;
  arena_state: string;
  arena_country: string
}