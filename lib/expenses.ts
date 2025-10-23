import type { Row } from '@/types/expense';
import { getDb } from './db';
import monthlyCost from './monthlyCost';

export async function readAll(): Promise<Row[]> {
    const db = getDb();
    return (await db.getAllAsync<Row>(`SELECT * FROM expenses ORDER BY id ASC;`)) ?? [];
}

export async function insertRow(payload: Omit<Row, 'id' | 'monthly_cost'>) {
    const db = getDb();
    const monthly_cost = monthlyCost(payload.cost, payload.frequency);
    await db.runAsync(
        `INSERT INTO expenses (item, cost, category, frequency, monthly_cost, payment_method, deadline)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [payload.item, payload.cost, payload.category, payload.frequency, monthly_cost, payload.payment_method, payload.deadline ?? '']
    );
}

export async function updateRow(id: number, payload: Omit<Row, 'id' | 'monthly_cost'>) {
    const db = getDb();
    const monthly_cost = monthlyCost(payload.cost, payload.frequency);
    await db.runAsync(
        `UPDATE expenses
       SET item = ?, cost = ?, category = ?, frequency = ?, monthly_cost = ?,
           payment_method = ?, deadline = ?
     WHERE id = ?;`,
        [
            payload.item,
            payload.cost,
            payload.category,
            payload.frequency,
            monthly_cost,
            payload.payment_method,
            payload.deadline ?? '',
            id,
        ]
    );
}

export async function deleteRow(id: number) {
    const db = getDb();
    await db.runAsync(`DELETE FROM expenses WHERE id = ?;`, [id]);
}

export async function seedIfEmpty() {
    const db = getDb();
    const c = await db.getFirstAsync<{ cnt: number }>(`SELECT COUNT(*) as cnt FROM expenses;`);
    if ((c?.cnt ?? 0) > 0) return;

    const seeds = [
        { item: 'Spotify', cost: 10.99, category: 'Subscriptions', frequency: 'Monthly', payment_method: 'Direct Debit', deadline: '2025-09-01' },
        { item: 'Amazon Prime', cost: 95, category: 'Subscriptions', frequency: 'Annual', payment_method: 'Visa ****1234', deadline: '2025-12-15' },
        { item: 'Council Tax', cost: 150, category: 'Housing', frequency: 'Monthly', payment_method: 'Direct Debit', deadline: '2025-09-01' },
    ] as const;

    for (const s of seeds) await insertRow({ ...s });
}

// ---- selectors / aggregations ----
export const monthKey = (iso?: string) => (iso ?? '').slice(0, 7); // "YYYY-MM"

export function groupByCategory(rows: Row[]): Array<[string, number]> {
    const map = new Map<string, number>();
    rows.forEach(r => map.set(r.category, (map.get(r.category) || 0) + (r.monthly_cost || 0)));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

export function groupByPaymentMethod(rows: Row[]): Array<[string, number]> {
    const map = new Map<string, number>();
    rows.forEach(r => {
        const key = r.payment_method || '—';
        map.set(key, (map.get(key) || 0) + (r.monthly_cost || 0));
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

export function dueInMonth(rows: Row[], yyyymm: string): Row[] {
    return rows
        .filter(r => r.deadline && monthKey(r.deadline) === yyyymm)
        .sort((a, b) => (a.deadline < b.deadline ? -1 : a.deadline > b.deadline ? 1 : 0));
}

export function totals(rows: Row[], monthlyIncome: number) {
    const totalMonthly = rows.reduce((s, r) => s + (r.monthly_cost || 0), 0);
    const totalAnnual = totalMonthly * 12;
    const remaining = monthlyIncome - totalMonthly;
    const overBudget = remaining < 0;
    return { totalMonthly, totalAnnual, remaining, overBudget };
}

