// /src/app/api/migrations.ts

import { db } from "./database";

export const migrate = () => {
  db.serialize(() => {
   db.run(
    `
      CREATE TABLE IF NOT EXISTS games (
        game_date DATE NOT NULL,
        home_team TEXT NOT NULL,
        home_team_name TEXT NOT NULL,
        home_team_score INTEGER NOT NULL,
        home_team_logo TEXT NOT NULL,
        away_team TEXT NOT NULL,
        away_team_name TEXT NOT NULL,
        away_team_score INTEGER NOT NULL,
        away_team_logo TEXT NOT NULL,
        game_center_link TEXT NOT NULL,
        arena TEXT NOT NULL,
      );
    `,
    (err: Error) => {
     if (err) {
      console.error(err.message);
     }
     console.log("games table created successfully.");
    }
   );
  });
}