// lib/monthlyCost.ts
export default function monthlyCost(cost: number, frequency: string) {
    const f = (frequency || '').toLowerCase().trim();
    if (f === 'monthly') return cost;
    if (f === 'annual' || f === 'annually' || f === 'yearly') return +((cost || 0) / 12).toFixed(2);
    // everything else treated as non-recurring for monthly view
    return 0;
}
