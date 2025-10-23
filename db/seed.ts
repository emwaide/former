import { getUser, upsertUser, createReading } from './dao';
import { lbToKg } from '../lib/metrics';

export const seedDemoData = async () => {
  const existing = await getUser();
  if (existing) return existing;

  const user = await upsertUser({
    id: 'demo-user',
    name: 'Emily',
    email: 'emily@example.com',
    sex: 'F',
    heightCm: 168,
    unitSystem: 'imperial',
    startWeightKg: lbToKg(182),
    targetWeightKg: lbToKg(150),
  });

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7 * 12);
  let weightLb = 182;
  let bodyFat = 32;
  let muscleMass = 65;
  const hydrationBase = 52;

  if (!user) {
    throw new Error('Unable to seed demo user');
  }

  for (let week = 0; week < 12; week += 1) {
    const takenAt = new Date(startDate);
    takenAt.setDate(startDate.getDate() + week * 7 + 2);
    const trendLoss = week < 4 ? 2.1 : week < 8 ? 1.9 : 1.4;
    weightLb -= trendLoss;
    bodyFat -= week % 2 === 0 ? 0.4 : 0.3;
    muscleMass -= week % 3 === 0 ? 0.1 : 0;
    const hydration = hydrationBase + (week % 4 === 0 ? -1.5 : 0.8);

    await createReading({
      userId: user.id,
      takenAt: takenAt.toISOString(),
      weightKg: lbToKg(weightLb),
      bodyFatPct: bodyFat,
      subcutFatPct: bodyFat * 0.7,
      visceralFatIdx: 9 - week * 0.1,
      bodyWaterPct: hydration,
      skeletalMusclePct: 40 - week * 0.1,
      muscleMassKg: lbToKg(muscleMass),
      boneMassKg: lbToKg(7.5),
      proteinPct: 17 + week * 0.05,
      bmrKcal: 1480 - week * 5,
      metabolicAge: 32 - Math.floor(week / 4),
      notes: week % 3 === 0 ? 'Long walk and strength session.' : 'Steady routines.',
    });
  }

  return user;
};
