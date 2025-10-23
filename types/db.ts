export type Sex = 'F' | 'M' | 'Other';

export type UnitSystem = 'metric' | 'imperial';

export type UserProfile = {
  id: string;
  email?: string | null;
  name: string;
  sex: Sex;
  heightCm: number;
  unitSystem: UnitSystem;
  startWeightKg: number;
  targetWeightKg: number;
};

export type Reading = {
  id: string;
  userId: string;
  takenAt: string;
  weightKg: number;
  bodyFatPct: number;
  subcutFatPct: number;
  visceralFatIdx: number;
  bodyWaterPct: number;
  skeletalMusclePct: number;
  muscleMassKg: number;
  boneMassKg: number;
  proteinPct: number;
  bmrKcal: number;
  metabolicAge: number;
  notes?: string | null;
};

export type ReadingInput = Omit<Reading, 'id'>;
