import { getDatabase } from './init';
import { Reading, ReadingInput, UnitSystem, UserProfile } from '../types/db';

const generateId = () =>
  globalThis.crypto?.randomUUID?.() ?? `id-${Math.random().toString(36).slice(2, 11)}-${Date.now().toString(36)}`;

const mapUserRow = (row: any): UserProfile => ({
  id: row.id,
  email: row.email,
  name: row.name,
  sex: row.sex,
  heightCm: row.heightCm,
  unitSystem: row.unitSystem as UnitSystem,
  startWeightKg: row.startWeightKg,
  targetWeightKg: row.targetWeightKg,
});

const mapReadingRow = (row: any): Reading => ({
  id: row.id,
  userId: row.userId,
  takenAt: row.takenAt,
  weightKg: row.weightKg,
  bodyFatPct: row.bodyFatPct,
  subcutFatPct: row.subcutFatPct,
  visceralFatIdx: row.visceralFatIdx,
  bodyWaterPct: row.bodyWaterPct,
  skeletalMusclePct: row.skeletalMusclePct,
  muscleMassKg: row.muscleMassKg,
  boneMassKg: row.boneMassKg,
  proteinPct: row.proteinPct,
  bmrKcal: row.bmrKcal,
  metabolicAge: row.metabolicAge,
  notes: row.notes,
});

export const getUser = async () => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<UserProfile>('SELECT * FROM users LIMIT 1;');
  return result ? mapUserRow(result) : null;
};

export const upsertUser = async (user: Partial<UserProfile>) => {
  const db = await getDatabase();
  const existing = await getUser();
  if (!existing) {
    const id = user.id ?? generateId();
    await db.runAsync(
      `INSERT INTO users (id, email, name, sex, heightCm, unitSystem, startWeightKg, targetWeightKg) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      id,
      user.email ?? null,
      user.name ?? 'Explorer',
      user.sex ?? 'F',
      user.heightCm ?? 165,
      user.unitSystem ?? 'metric',
      user.startWeightKg ?? 80,
      user.targetWeightKg ?? 65,
    );
    const inserted = await db.getFirstAsync<UserProfile>('SELECT * FROM users WHERE id = ?;', id);
    return inserted ? mapUserRow(inserted) : null;
  }

  const updated = { ...existing, ...user } as UserProfile;
  await db.runAsync(
    `UPDATE users SET email = ?, name = ?, sex = ?, heightCm = ?, unitSystem = ?, startWeightKg = ?, targetWeightKg = ? WHERE id = ?;`,
    updated.email ?? null,
    updated.name,
    updated.sex,
    updated.heightCm,
    updated.unitSystem,
    updated.startWeightKg,
    updated.targetWeightKg,
    updated.id,
  );
  return updated;
};

export const listReadings = async (userId: string) => {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Reading>('SELECT * FROM readings WHERE userId = ? ORDER BY takenAt ASC;', userId);
  return rows.map(mapReadingRow);
};

export const createReading = async (input: ReadingInput) => {
  const db = await getDatabase();
  const id = generateId();
  await db.runAsync(
    `INSERT INTO readings (
      id, userId, takenAt, weightKg, bodyFatPct, subcutFatPct, visceralFatIdx, bodyWaterPct, skeletalMusclePct,
      muscleMassKg, boneMassKg, proteinPct, bmrKcal, metabolicAge, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    id,
    input.userId,
    input.takenAt,
    input.weightKg,
    input.bodyFatPct,
    input.subcutFatPct,
    input.visceralFatIdx,
    input.bodyWaterPct,
    input.skeletalMusclePct,
    input.muscleMassKg,
    input.boneMassKg,
    input.proteinPct,
    input.bmrKcal,
    input.metabolicAge,
    input.notes ?? null,
  );
  const row = await db.getFirstAsync<Reading>('SELECT * FROM readings WHERE id = ?;', id);
  return row ? mapReadingRow(row) : null;
};

export const updateReading = async (id: string, input: Partial<Reading>) => {
  const db = await getDatabase();
  const existing = await db.getFirstAsync<Reading>('SELECT * FROM readings WHERE id = ?;', id);
  if (!existing) return null;
  const updated = { ...existing, ...input } as Reading;
  await db.runAsync(
    `UPDATE readings SET takenAt = ?, weightKg = ?, bodyFatPct = ?, subcutFatPct = ?, visceralFatIdx = ?, bodyWaterPct = ?, skeletalMusclePct = ?,
      muscleMassKg = ?, boneMassKg = ?, proteinPct = ?, bmrKcal = ?, metabolicAge = ?, notes = ? WHERE id = ?;`,
    updated.takenAt,
    updated.weightKg,
    updated.bodyFatPct,
    updated.subcutFatPct,
    updated.visceralFatIdx,
    updated.bodyWaterPct,
    updated.skeletalMusclePct,
    updated.muscleMassKg,
    updated.boneMassKg,
    updated.proteinPct,
    updated.bmrKcal,
    updated.metabolicAge,
    updated.notes ?? null,
    updated.id,
  );
  return updated;
};

export const deleteReading = async (id: string) => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM readings WHERE id = ?;', id);
};
