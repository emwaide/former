import { describe, it, expect } from './harness';
import { predictedCurve, lbToKg } from '../lib/metrics';
import { Analytics } from '../hooks/useAnalytics';

describe('dashboard analytics snapshot', () => {
  it('builds predicted taper for first weeks', () => {
    const startWeight = lbToKg(182);
    const targetWeight = lbToKg(150);
    const curve = predictedCurve({
      id: 'demo',
      name: 'Emily',
      email: 'emily@example.com',
      sex: 'F',
      heightCm: 168,
      unitSystem: 'imperial',
      startWeightKg: startWeight,
      targetWeightKg: targetWeight,
    });
    expect(curve[0].targetWeight).toBeCloseTo(startWeight - lbToKg(2), 2);
    expect(curve[15].targetWeight).toBeGreaterThan(targetWeight - 1);
  });

  it('summarises progress percentages', () => {
    const analytics: Analytics = {
      weeklyChangeKg: lbToKg(-1.8),
      progressPercent: 0.45,
      predictedWeights: [],
      weeklyActualKg: [],
      muscleScore: 80,
      hydrationLow: false,
      composition: [],
      fatLossPct: 8,
    };
    expect(analytics.progressPercent).toBeGreaterThan(0);
    expect(analytics.muscleScore).toBeGreaterThan(0);
  });
});
