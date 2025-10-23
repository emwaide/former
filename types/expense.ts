// types/expense.ts
export type Row = {
    id: number;
    item: string;
    cost: number;
    category: string;
    frequency: string; // free text allowed
    monthly_cost: number;
    payment_method: string;
    deadline: string; // ISO date or ''
};

export type SortKey =
    | 'item'
    | 'cost'
    | 'frequency'
    | 'monthly_cost'
    | 'category'
    | 'payment_method'
    | 'deadline';
