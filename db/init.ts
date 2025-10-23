import { SQLiteDatabase, openDatabaseAsync } from 'expo-sqlite';

let databasePromise: Promise<SQLiteDatabase> | null = null;

export const getDatabase = async () => {
  if (!databasePromise) {
    databasePromise = openDatabaseAsync('former.db');
  }
  return databasePromise;
};

export const migrate = async () => {
  const db = await getDatabase();
  await db.execAsync('PRAGMA foreign_keys = ON;');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT,
      name TEXT,
      sex TEXT,
      heightCm REAL,
      unitSystem TEXT DEFAULT 'metric',
      startWeightKg REAL,
      targetWeightKg REAL
    );
  `);
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS readings (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      takenAt TEXT NOT NULL,
      weightKg REAL,
      bodyFatPct REAL,
      subcutFatPct REAL,
      visceralFatIdx REAL,
      bodyWaterPct REAL,
      skeletalMusclePct REAL,
      muscleMassKg REAL,
      boneMassKg REAL,
      proteinPct REAL,
      bmrKcal INTEGER,
      metabolicAge INTEGER,
      notes TEXT,
      FOREIGN KEY(userId) REFERENCES users(id)
    );
  `);
  await db.execAsync('CREATE INDEX IF NOT EXISTS idx_readings_user_time ON readings(userId, takenAt);');
};

export const initializeDatabase = async () => {
  await migrate();
};
