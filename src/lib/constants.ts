import { League } from "@/types/league";
import { Sport } from "@/types/sport";
import { VenueType } from "@/types/venue-type";

// API constants.
export const API_BASE: string = "https://site.api.espn.com/apis/site/v2/sports";
export const API_PATH: string = "scoreboard";

// League-to-sport mapping.
export const LEAGUE_TO_SPORT_MAPPING: Record<League, Sport[keyof Sport]> = {
    "college-football": "football",
    "nba": "basketball",
    "nhl": "hockey",
    "college-basketball": "basketball",
    "nfl": "football",
    "mlb": "baseball",
    "arg.1": "soccer",
}

// League-to-venue mapping.
export const LEAGUE_TO_VENUE_TYPE_MAPPING: Record<League, VenueType[keyof VenueType]> = {
    "college-football": "Stadiums",
    "nba": "Arenas",
    "nhl": "Arenas",
    "college-basketball": "Arenas",
    "nfl": "Stadiums",
    "mlb": "Stadiums",
    "arg.1": "Stadiums",
}

// Leagues where we should display ties.
export const LEAGUE_TIES_ALLOWED: { [key: string]: boolean} = {
    "arg.1": true,
    "nfl": true,
    "nhl": false, // they did allow ties in the past though
    "mlb": false,
    "college-football": false,
    "college-basketball": false,
    "nba": false,
}