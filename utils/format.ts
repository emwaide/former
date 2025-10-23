import { kgToLb } from '../lib/metrics';
import { Reading, UnitSystem } from '../types/db';

export const formatWeight = (weightKg: number, unit: UnitSystem) =>
  unit === 'imperial' ? `${(kgToLb(weightKg)).toFixed(1)} lb` : `${weightKg.toFixed(1)} kg`;

export const formatWeeklyChange = (changeKg: number, unit: UnitSystem) => {
  const weight = unit === 'imperial' ? kgToLb(changeKg) : changeKg;
  const sign = weight > 0 ? '+' : '';
  return `${sign}${weight.toFixed(1)} ${unit === 'imperial' ? 'lb' : 'kg'}`;
};

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

export const sortReadingsDesc = (readings: Reading[]) =>
  [...readings].sort((a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime());
