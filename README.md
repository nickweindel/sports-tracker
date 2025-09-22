# Sports Game Tracker

A web application built with **Next.js**, **PostgreSQL**, and **ShadCN UI**, designed to track sports games across different leagues and venues. Users can view, add, and delete game data, as well as analyze venue and team stats.

---

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) with [ShadCN UI](https://ui.shadcn.com/) and [Lucide Icons](https://lucide.dev/)
- **Database**: PostgreSQL (local via Docker)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Icons**: Lucide + league logos in `/public/league-logos`

---

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS games (
    game_id INTEGER NOT NULL,
    league TEXT NOT NULL, 
    game_date DATE NOT NULL,
    home_team TEXT NOT NULL,
    home_team_name TEXT NOT NULL,
    home_team_score INTEGER NOT NULL,
    home_team_logo TEXT NOT NULL,
    home_team_rank TEXT NULL,
    away_team TEXT NOT NULL,
    away_team_name TEXT NOT NULL,
    away_team_score INTEGER NOT NULL,
    away_team_logo TEXT NOT NULL,
    away_team_rank TEXT NULL,
    game_center_link TEXT,
    arena TEXT NOT NULL,
    arena_city TEXT NOT NULL,
    arena_state TEXT NOT NULL,
    arena_country TEXT NOT NULL,
    PRIMARY KEY (game_id, league, game_date, home_team, away_team)
);
```

---

## Project Structure

```
.
├── public/
│   └── league-logos/         # PNG icons for each league
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── [sports]/[league]/route.ts   # Main API: writes game data
│   │   │   ├── arenas/route.ts              # Gets game counts per arena/stadium
│   │   │   ├── games/route.ts               # GET, POST, DELETE games
│   │   │   └── teams/route.ts               # Team-specific game stats
│   │   ├── page.tsx          # The only page in the app
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── shared/           # Custom reusable components
│   │   └── ui/               # ShadCN components
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── db.ts             # DB connection/config
│   │   └── utils.ts
│   └── types/                # TypeScript types (arena, game, etc.)
├── init.sql                  # SQL schema (optional for setup)
├── test-db.js                # Utility to test DB connection
├── package.json
├── pnpm-lock.yaml
└── README.md
```

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (for PostgreSQL)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/project-name.git
   cd project-name
   ```

2. **Start the PostgreSQL container**
   ```bash
   docker run --name project-db -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres
   ```

3. **Initialize the database**
   ```bash
   psql -h localhost -U postgres -d postgres -f init.sql
   ```

4. **Install dependencies**
   ```bash
   pnpm install
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open the app in your browser**
   http://localhost:3000


---

## API Routes

| Route                        | Method | Description                           |
|-----------------------------|--------|---------------------------------------|
| `/api/games`                | GET    | Fetch all game records                |
| `/api/games`                | POST   | Add a new game                        |
| `/api/games`                | DELETE | Delete a game                         |
| `/api/arenas`               | GET    | Get count of games per arena          |
| `/api/teams`                | GET    | Fetch a team's record                 |
| `/api/[sports]/[league]`    | POST   | Insert league-specific game data      |


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

- [ ] Deploy to a real web service
- [ ] Add authentication/login and user-specific tracking
- [ ] Integrate automated handling of certain edge cases (e.g. relocated teams, neutral sites, etc.)
- [ ] Create analytics (e.g. top goal scorers for NHL games, winning pitchers for MLB games, etc.)
- [ ] Refactor game selection to require less manual input (i.e. create a dropdown of selectable games once a league is selected)
- [ ] Allow ability to share games attended with others (i.e. have a view-only mode)
