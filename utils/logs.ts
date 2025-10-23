import { Reading } from '../types/db';

const toDateKey = (iso: string) => iso.split('T')[0];

const differenceInDays = (later: Date, earlier: Date) => {
  const msInDay = 1000 * 60 * 60 * 24;
  return Math.round((later.getTime() - earlier.getTime()) / msInDay);
};

export const countRecentLogs = (readings: Reading[], windowDays = 7) => {
  if (readings.length === 0) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const windowStart = new Date(today);
  windowStart.setDate(windowStart.getDate() - (windowDays - 1));

  return readings.filter((reading) => {
    const takenAt = new Date(reading.takenAt);
    takenAt.setHours(0, 0, 0, 0);
    return takenAt >= windowStart;
  }).length;
};

export const countConsecutiveLogDays = (readings: Reading[]) => {
  if (readings.length === 0) return 0;

  const uniqueDays = Array.from(new Set(readings.map((reading) => toDateKey(reading.takenAt))));
  uniqueDays.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  let previousDate: Date | null = null;

  for (const day of uniqueDays) {
    const currentDate = new Date(day);
    if (!previousDate) {
      streak = 1;
      previousDate = currentDate;
      continue;
    }

    const diff = differenceInDays(previousDate, currentDate);
    if (diff === 1) {
      streak += 1;
      previousDate = currentDate;
    } else if (diff === 0) {
      continue;
    } else {
      break;
    }
  }

  return streak;
};
