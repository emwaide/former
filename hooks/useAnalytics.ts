import { useMemo } from 'react';
import {
  cumulativeFatLossPct,
  hydrationFlag,
  musclePreservationScore,
  predictedCurve,
  progressToGoal,
  weeklyChange,
  weeklyWeightSeries,
} from '../lib/metrics';
import { Reading, UserProfile } from '../types/db';

export type Analytics = {
  weeklyChangeKg: number;
  progressPercent: number;
  predictedWeights: { week: number; targetWeightKg: number }[];
  weeklyActualKg: { week: string; weightKg: number }[];
  muscleScore: number;
  hydrationLow: boolean;
  composition: { label: string; fatPct: number; leanPct: number }[];
  fatLossPct: number;
};

const defaultAnalytics: Analytics = {
  weeklyChangeKg: 0,
  progressPercent: 0,
  predictedWeights: [],
  weeklyActualKg: [],
  muscleScore: 50,
  hydrationLow: false,
  composition: [],
  fatLossPct: 0,
};

export const useAnalytics = (user: UserProfile | null, readings: Reading[]): Analytics =>
  useMemo(() => {
    if (!user || readings.length === 0) return defaultAnalytics;
    const sorted = [...readings].sort((a, b) => new Date(a.takenAt).getTime() - new Date(b.takenAt).getTime());
    const latest = sorted[sorted.length - 1];
    const first = sorted[0];

    const weeklyDelta = weeklyChange(sorted);
    const progress = progressToGoal(user, latest.weightKg);
    const predicted = predictedCurve(user);
    const weeklyActual = weeklyWeightSeries(sorted);
    const muscleScore = musclePreservationScore(
      user.startWeightKg,
      latest.weightKg,
      first.muscleMassKg,
      latest.muscleMassKg,
    );
    const hydrationLow = hydrationFlag(sorted);
    const composition = weeklyActual.map((week) => {
      const entries = sorted.filter((reading) => reading.takenAt.startsWith(week.week));
      const averageFat =
        entries.reduce((sum, entry) => sum + entry.bodyFatPct, 0) / (entries.length || 1);
      const lean = 100 - averageFat;
      return {
        label: new Date(week.week).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        fatPct: Math.max(0, Math.min(100, averageFat)),
        leanPct: Math.max(0, Math.min(100, lean)),
      };
    });

    return {
      weeklyChangeKg: weeklyDelta,
      progressPercent: progress,
      predictedWeights: predicted.map((entry) => ({
        week: entry.week,
        targetWeightKg: entry.targetWeight,
      })),
      weeklyActualKg: weeklyActual.map((item) => ({
        week: item.week,
        weightKg: item.weightKg,
      })),
      muscleScore,
      hydrationLow,
      composition,
      fatLossPct: cumulativeFatLossPct(sorted),
    };
  }, [readings, user]);
