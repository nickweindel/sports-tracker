# Sports Game Tracker

A web application built with **Next.js**, **Supabase**, and **ShadCN UI** and deployed with **Vercel**, designed to track sports games across different leagues and venues. Users can view, add, and delete game data, as well as analyze venue and team stats.

---

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) with [ShadCN UI](https://ui.shadcn.com/) and [Lucide Icons](https://lucide.dev/)
- **Database**: [Supabase](https://supabase.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Icons**: Lucide + league logos in `/public/league-logos`
- **Deployment**: [Vercel](https://vercel.com/)

---

## Database Schema

```sql
create table public.games (
  user_email text not null,
  game_id integer not null,
  league text not null,
  game_date date not null,
  home_team text not null,
  home_team_name text not null,
  home_team_score integer not null,
  home_team_logo text not null,
  home_team_rank integer null,
  away_team text not null,
  away_team_name text not null,
  away_team_score integer not null,
  away_team_logo text not null,
  away_team_rank integer null,
  game_center_link text null,
  arena text not null,
  arena_city text null,
  arena_state text null,
  arena_country text null,
  neutral_site boolean, 
  notes text null,
  constraint games_pkey primary key (
    user_email,
    game_id,
    league,
    game_date,
    home_team,
    away_team
  )
)

create table public.rank_override (
  game_id integer not null,
  league text not null,
  home_team_rank integer null,
  away_team_rank integer null,
  constraint rank_override_pkey primary key (game_id, league)
)

create table public.team_override (
  league text not null,
  team_abbreviation text not null,
  team_abbreviation_override text null,
  team_logo text null,
  constraint team_override_pkey primary key (league, team_abbreviation)
)
```

Rank override handles college sports games where one or more teams has the incorrect ranking. Team override is a way to handle teams that have relocated or have different abbreviations to ensure consistency in logos and abbreviations. Long-term, this should be handled in a more elegant way, such as using a team ID. An example is the Oakland Athletics. Their old logo, `oak.png` is not found anymore on ESPN's website, so it needs to be hardcoded to `ath.png`.

---

## Project Structure

```
.
├── public/
│   └── league-logos/         # PNG icons for each league
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── [sports]/[league]/route.ts           # Main API: writes game data
|   |   |   ├── [sports]/[league]/events/route.ts    # Fetches games for a given league that have gone final
│   │   │   ├── arenas/route.ts                      # Gets game counts per arena/stadium
│   │   │   ├── games/route.ts                       # GET, POST, DELETE games
│   │   │   └── teams/route.ts                       # Team-specific game stats
|   |   ├── auth/             # Pages for performing auth actions (change password, login, etc.)
│   │   ├── page.tsx          # The only page in the app
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
|   |   ├── auth/             # Auth components used in auth pages
│   │   ├── shared/           # Custom reusable components
│   │   └── ui/               # ShadCN components
│   ├── lib/
|   |   ├── supabase          # Supabase client, server, and middleware utilities
│   │   ├── constants.ts
│   │   └── utils.ts
│   └── types/                # TypeScript types (arena, game, etc.)
├── supabase/
│   ├── migrations/
│   │   ├── README.md
│   │   └── 20260206224440_remote_schema.sql # Baseline checkin of supabase schema
├── package.json
├── pnpm-lock.yaml
└── README.md
```

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/project-name.git
   cd project-name
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Open the app in your browser**
   http://localhost:3000


---

## API Routes

| Route                        | Method | Description                          |
|-----------------------------|--------|---------------------------------------|
| `/api/games`                | GET    | Fetch all game records                |
| `/api/games`                | POST   | Add a new game                        |
| `/api/games`                | DELETE | Delete a game                         |
| `/api/arenas`               | GET    | Get count of games per arena          |
| `/api/teams`                | GET    | Fetch a team's record                 |
| `/api/[sports]/[league]`    | GET    | Get league-specific game data         |
| `/api/[sports]/[league]/events`| GET | Get all events for a specific league  |
| `/api/update-notes`         | POST   | Update notes you've taken for a selected game |


---

## Assets

- League icons and logos are stored in `/public/league-logos`
- Other generic icons are stored directly in `/public`
- Assets are used in UI components like dropdowns and cards

---

## Notes

- The app is built using the **App Router** in Next.js (`/src/app`)
- Currently functions as a single-page dashboard (`page.tsx`)
- Uses modular API routes for fetching and updating game data
- The database table has a composite primary key to ensure uniqueness
- Ideal for tracking in-person sports attendance, scores, and venues

---

## TODOs / Improvements

- [ ] Integrate automated handling of certain edge cases (e.g. relocated teams, neutral sites, etc.)
- [ ] Create analytics (e.g. top goal scorers for NHL games, winning pitchers for MLB games, etc.)
- [ ] Allow ability to share games attended with others (i.e. have a view-only mode)
