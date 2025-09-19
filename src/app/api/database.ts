// /src/app/api/database.ts

import path from "path";
import Database from "better-sqlite3";

const dbPath = path.join(process.cwd(), "profile.db");
export const db = new Database(dbPath);

console.log("Connected to the profile database.");
