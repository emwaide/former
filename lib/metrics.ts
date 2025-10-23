import { Reading, UserProfile } from '../types/db';

export const lbToKg = (lb: number) => lb * 0.45359237;
export const kgToLb = (kg: number) => kg / 0.45359237;
export const cmToM = (cm: number) => cm / 100;
export const mToCm = (m: number) => m * 100;

export const bmi = (weightKg: number, heightCm: number) => {
  const heightM = cmToM(heightCm);
  if (heightM === 0) return 0;
  return weightKg / (heightM * heightM);
};

export const fatMass = (weight: number, bodyFatPct: number) => weight * (bodyFatPct / 100);
export const leanMass = (weight: number, bodyFatPct: number) => weight - fatMass(weight, bodyFatPct);

export const weeklyChange = (readings: Reading[]) => {
  if (readings.length < 2) return 0;
  const sorted = [...readings].sort((a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime());
  const latest = sorted[0];
  const latestDate = new Date(latest.takenAt);
  const weekAgo = new Date(latestDate);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const previous = sorted.find((reading) => new Date(reading.takenAt) <= weekAgo);
  if (!previous) return 0;
  return latest.weightKg - previous.weightKg;
};

export const progressToGoal = (user: UserProfile, currentWeightKg: number) => {
  const { startWeightKg, targetWeightKg } = user;
  const denominator = startWeightKg - targetWeightKg;
  if (denominator === 0) return 0;
  const progress = (startWeightKg - currentWeightKg) / denominator;
  return Math.max(0, Math.min(1, progress));
};

type PredictedPoint = {
  week: number;
  targetWeight: number;
};

export const predictedCurve = (user: UserProfile): PredictedPoint[] => {
  const stages = [
    { weeks: 4, lossPerWeek: 2.0 },
    { weeks: 4, lossPerWeek: 1.8 },
    { weeks: 4, lossPerWeek: 1.5 },
    { weeks: 4, lossPerWeek: 1.2 },
  ];
  const result: PredictedPoint[] = [];
  let cumulativeLoss = 0;
  let currentWeek = 1;
  for (const stage of stages) {
    for (let i = 0; i < stage.weeks; i += 1) {
      cumulativeLoss += stage.lossPerWeek;
      result.push({
        week: currentWeek,
        targetWeight: Math.max(
          user.targetWeightKg,
          user.startWeightKg - lbToKg(cumulativeLoss),
        ),
      });
      currentWeek += 1;
    }
  }
  return result;
};

export const musclePreservationScore = (
  startWeightKg: number,
  currentWeightKg: number,
  startMuscleMassKg: number,
  currentMuscleMassKg: number,
) => {
  const weightDelta = startWeightKg - currentWeightKg;
  const muscleDelta = startMuscleMassKg - currentMuscleMassKg;
  if (weightDelta <= 0) return 50;
  const ratio = 1 - muscleDelta / Math.max(weightDelta, 0.1);
  const score = Math.round(ratio * 100);
  return Math.max(0, Math.min(100, score));
};

export const hydrationFlag = (readings: Reading[]) => {
  if (readings.length < 5) return false;
  const sorted = [...readings].sort((a, b) => new Date(a.takenAt).getTime() - new Date(b.takenAt).getTime());
  const latest = sorted[sorted.length - 1];
  const priorFour = sorted.slice(-5, -1);
  const avg = priorFour.reduce((sum, r) => sum + (r.bodyWaterPct ?? 0), 0) / priorFour.length;
  return latest.bodyWaterPct < avg - 2;
};

export const cumulativeFatLossPct = (readings: Reading[]) => {
  if (readings.length === 0) return 0;
  const sorted = [...readings].sort((a, b) => new Date(a.takenAt).getTime() - new Date(b.takenAt).getTime());
  const first = sorted[0];
  const latest = sorted[sorted.length - 1];
  const fatMassStart = fatMass(first.weightKg, first.bodyFatPct);
  const fatMassCurrent = fatMass(latest.weightKg, latest.bodyFatPct);
  if (fatMassStart === 0) return 0;
  return Math.max(0, ((fatMassStart - fatMassCurrent) / fatMassStart) * 100);
};

export const deriveWeekBuckets = (readings: Reading[]) => {
  const buckets: Record<string, Reading[]> = {};
  readings.forEach((reading) => {
    const date = new Date(reading.takenAt);
    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(date.getDate() - date.getDay());
    const key = firstDayOfWeek.toISOString().split('T')[0];
    if (!buckets[key]) {
      buckets[key] = [];
    }
    buckets[key].push(reading);
  });
  return buckets;
};

export const weeklyWeightSeries = (readings: Reading[]) => {
  const buckets = deriveWeekBuckets(readings);
  return Object.keys(buckets)
    .sort()
    .map((key) => {
      const bucket = buckets[key];
      const average = bucket.reduce((sum, item) => sum + item.weightKg, 0) / bucket.length;
      return { week: key, weightKg: average };
    });
};
