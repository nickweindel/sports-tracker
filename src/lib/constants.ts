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
    "wnba": "basketball",
    "nhl": "hockey",
    "mens-college-basketball": "basketball",
    "womens-college-basketball": "basketball",
    "nfl": "football",
    "mlb": "baseball",
    "arg.1": "soccer",
    "eng.1": "soccer",
    "usa.1": "soccer",
    "fra.1": "soccer",
    "esp.1": "soccer",
    "ned.1": "soccer",
    "ita.1": "soccer",
    "mex.1": "soccer",
    "bra.1": "soccer",
    "por.1": "soccer",
}

// League-to-venue mapping.
export const LEAGUE_TO_VENUE_TYPE_MAPPING: Record<League, VenueType[keyof VenueType]> = {
    "college-football": "Stadiums",
    "nba": "Arenas",
    "wnba": "Arenas",
    "nhl": "Arenas",
    "mens-college-basketball": "Arenas",
    "womens-college-basketball": "Arenas",
    "nfl": "Stadiums",
    "mlb": "Stadiums",
    "arg.1": "Stadiums",
    "eng.1": "Stadiums",
    "usa.1": "Stadiums",
    "fra.1": "Stadiums",
    "esp.1": "Stadiums",
    "ned.1": "Stadiums",
    "ita.1": "Stadiums",
    "mex.1": "Stadiums",
    "bra.1": "Stadiums",
    "por.1": "Stadiums",
}

// Leagues where we should display ties.
export const LEAGUE_TIES_ALLOWED: { [key: string]: boolean} = {
    "arg.1": true,
    "nfl": true,
    "nhl": false, // they did allow ties in the past though
    "mlb": false,
    "college-football": false,
    "mens-college-basketball": false,
    "nba": false,
}