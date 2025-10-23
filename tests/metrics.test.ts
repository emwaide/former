import { describe, it, expect } from './harness';
import {
  lbToKg,
  kgToLb,
  bmi,
  fatMass,
  leanMass,
  weeklyChange,
  progressToGoal,
  predictedCurve,
  musclePreservationScore,
  hydrationFlag,
  cumulativeFatLossPct,
} from '../lib/metrics';
import { Reading, UserProfile } from '../types/db';

const demoUser: UserProfile = {
  id: 'demo',
  name: 'Emily',
  email: 'emily@example.com',
  sex: 'F',
  heightCm: 168,
  unitSystem: 'imperial',
  startWeightKg: lbToKg(182),
  targetWeightKg: lbToKg(150),
};

const buildReading = (overrides: Partial<Reading>): Reading => ({
  id: Math.random().toString(),
  userId: 'demo',
  takenAt: new Date().toISOString(),
  weightKg: lbToKg(180),
  bodyFatPct: 30,
  subcutFatPct: 20,
  visceralFatIdx: 8,
  bodyWaterPct: 52,
  skeletalMusclePct: 38,
  muscleMassKg: lbToKg(65),
  boneMassKg: lbToKg(7),
  proteinPct: 18,
  bmrKcal: 1480,
  metabolicAge: 31,
  notes: '',
  ...overrides,
});

describe('metrics utilities', () => {
  it('converts between imperial and metric', () => {
    expect(lbToKg(10)).toBeCloseTo(4.5359, 4);
    expect(kgToLb(10)).toBeCloseTo(22.0462, 4);
  });

  it('computes bmi', () => {
    expect(bmi(lbToKg(160), 165)).toBeCloseTo(26.7, 1);
  });

  it('splits fat and lean mass', () => {
    const fat = fatMass(lbToKg(180), 30);
    const lean = leanMass(lbToKg(180), 30);
    expect(fat + lean).toBeCloseTo(lbToKg(180), 5);
  });

  it('derives weekly change', () => {
    const now = new Date();
    const readings: Reading[] = [
      buildReading({ takenAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(), weightKg: lbToKg(182) }),
      buildReading({ takenAt: now.toISOString(), weightKg: lbToKg(178) }),
    ];
    expect(weeklyChange(readings)).toBeCloseTo(lbToKg(178) - lbToKg(182), 5);
  });

  it('computes progress to goal', () => {
    const progress = progressToGoal(demoUser, lbToKg(170));
    expect(progress).toBeGreaterThan(0);
  });

  it('produces a predicted curve', () => {
    const curve = predictedCurve(demoUser);
    expect(curve.length).toBeGreaterThan(0);
  });

  it('scores muscle preservation', () => {
    const score = musclePreservationScore(demoUser.startWeightKg, lbToKg(170), lbToKg(65), lbToKg(64.5));
    expect(score).toBeGreaterThan(0);
  });

  it('flags hydration dips', () => {
    const base = new Date();
    const readings: Reading[] = Array.from({ length: 5 }).map((_, index) =>
      buildReading({
        takenAt: new Date(base.getTime() + index * 24 * 60 * 60 * 1000).toISOString(),
        bodyWaterPct: index === 4 ? 46 : 52,
      }),
    );
    expect(hydrationFlag(readings)).toBeTruthy();
  });

  it('tracks cumulative fat loss percentage', () => {
    const readings: Reading[] = [
      buildReading({ takenAt: '2024-01-01T00:00:00.000Z', weightKg: lbToKg(182), bodyFatPct: 32 }),
      buildReading({ takenAt: '2024-03-01T00:00:00.000Z', weightKg: lbToKg(172), bodyFatPct: 28 }),
    ];
    expect(cumulativeFatLossPct(readings)).toBeGreaterThan(0);
  });
});
