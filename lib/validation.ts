export type ExpenseForm = {
    item: string;
    cost: string;         // raw text
    category: string;
    frequency: string;
    payment: string;
    deadline: string;     // '' or YYYY-MM-DD
};

export type ValidatedExpense = {
    item: string;
    cost: number;
    category: string;
    frequency: string;    // normalized case (Monthly/Annual/One-off/other as typed)
    payment_method: string;
    deadline: string;     // '' or YYYY-MM-DD
};

function normalizeFrequency(input: string) {
    const f = (input || '').trim().toLowerCase();
    if (['monthly', 'month', 'mo'].includes(f)) return 'Monthly';
    if (['annual', 'annually', 'yearly', 'yr', 'year'].includes(f)) return 'Annual';
    if (['one-off', 'one off', 'oneoff', 'single'].includes(f)) return 'One-off';
    // free text allowed; keep original capitalization (first letter)
    if (!input) return '';
    return input.slice(0, 1).toUpperCase() + input.slice(1);
}

export function validateExpense(values: ExpenseForm) {
    const errors: string[] = [];

    const item = (values.item || '').trim();
    if (!item) errors.push('Item is required.');

    // accept comma decimals
    const costNum = Number((values.cost || '').replace(',', '.'));
    if (!Number.isFinite(costNum) || costNum <= 0) errors.push('Cost must be a number greater than 0.');

    const category = (values.category || '').trim() || 'Uncategorized';
    const frequency = normalizeFrequency(values.frequency || 'Monthly');
    const payment_method = (values.payment || '').trim();

    const deadline = (values.deadline || '').trim();
    if (deadline && !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
        errors.push('Due date must be YYYY-MM-DD or left blank.');
    }

    const ok = errors.length === 0;
    const normalized: ValidatedExpense = {
        item,
        cost: ok ? costNum : 0,
        category,
        frequency,
        payment_method,
        deadline: deadline || '',
    };

    return { ok, errors, normalized };
}
