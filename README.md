# Sports Game Tracker

A web application built with **Next.js**, **Supabase**, and **ShadCN UI** and deployed with **Vercel**, designed to track sports games across different leagues and venues. Users can view, add, and delete game data; add notes and upload photos per game; and analyze venue and team stats.

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

create table public.game_photos (
  id uuid primary key default gen_random_uuid(),

  user_email text not null,
  game_id integer not null,
  league text not null,
  game_date date not null,
  home_team text not null,
  away_team text not null,

  storage_path text not null,
  caption text,
  created_at timestamp default now(),

  foreign key (
    user_email,
    game_id,
    league,
    game_date,
    home_team,
    away_team
  )
  references public.games (
    user_email,
    game_id,
    league,
    game_date,
    home_team,
    away_team
  )
  on delete cascade
);
```

- **Rank override** handles college sports games where one or more teams has the incorrect ranking.
- **Team override** handles relocated teams or different abbreviations for consistent logos and names (e.g. Oakland Athletics `oak.png` → `ath.png`). Long-term this could use a team ID.
- **game_photos** stores metadata for photos uploaded per game; files live in Supabase Storage in the public `photos` bucket.

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
│   │   │   ├── photos/route.ts                      # GET photos (storage URLs) for games
│   │   │   ├── teams/route.ts                       # Team-specific game stats
│   │   │   └── update-notes/route.ts                 # POST to update game notes
|   |   ├── auth/             # Pages for performing auth actions (change password, login, etc.)
│   │   ├── page.tsx          # The only page in the app
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
|   |   ├── auth/             # Auth components used in auth pages
│   │   ├── shared/           # Custom reusable components
│   │   └── ui/               # ShadCN components
│   ├── lib/
│   │   ├── supabase/        # Supabase client, server, and middleware utilities
│   │   ├── constants.ts
│   │   ├── photos.ts        # Photo upload helpers and fetchGamePhotos()
│   │   └── utils.ts
│   └── types/                # TypeScript types (arena, game, etc.)
├── supabase/
│   └── migrations/          # See supabase/migrations/README.md for migration list
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
| `/api/update-notes`         | POST   | Update notes for a selected game               |
| `/api/photos`              | GET    | Fetch photos for a user/league (optional `game_id` filter) |


---

## Assets

- League icons and logos are stored in `/public/league-logos`
- Other generic icons are stored directly in `/public`
- Assets are used in UI components like dropdowns and cards

---

## Linting

Currently, there are no pre-commit hooks for linting in this repository. Instead, follow the below instructions to clean files before committing.

### TypeScript

This repository uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for linting `.ts`, `.tsx`, `.js`, `.jsx`, `.css`, and `.md` files and keeping formatting consistent.

1. Check for issues:

```bash
pnpm run lint
```

2. Fix these issues:

```bash
pnpm run lint:fix
```

3. Format files with Prettier:

```bash
pnpm run format
```

### SQL

This repository uses [SQLFluff](https://www.sqlfluff.com/) for linting `.sql` files. 

First, make sure that sqlfluff is installed:

```bash
pip install sqlfluff
```

Before committing any SQL changes, run the following and make sure no fixable errors remain:

```bash
sqlfluff lint path/to/sql
sqlfluff fix path/to/sql
```

> Only lint new SQL migrations files. Linting and recommitting previous SQL files that are already a part of the migrations history should be avoided.

---

## Notes

- The app is built using the **App Router** in Next.js (`/src/app`)
- Single-page dashboard with game cards: notes (expand/collapse) and photos (count + dialog to cycle through images)
- Photos are uploaded to Supabase Storage and listed via `game_photos`; public URLs are served from `/api/photos`
- Uses modular API routes for fetching and updating game data
- Games use a composite primary key for uniqueness
- Ideal for tracking in-person sports attendance, scores, notes, and photos

---

## TODOs / Improvements

- [ ] Integrate automated handling of certain edge cases (e.g. relocated teams, neutral sites, etc.)
- [ ] Create analytics (e.g. top goal scorers for NHL games, winning pitchers for MLB games, etc.)
- [ ] Allow ability to share games attended with others (i.e. have a view-only mode)