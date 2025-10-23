// hooks/useExpenses.ts
import { ensureDb } from '@/lib/db';
import { readAll, seedIfEmpty } from '@/lib/expenses';
import type { Row } from '@/types/expense';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

export default function useExpenses() {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        await ensureDb();
        await seedIfEmpty();     // harmless if already seeded
        const data = await readAll();
        setRows(data);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    useFocusEffect(
        useCallback(() => {
            // reload when the screen regains focus (user added/edited elsewhere)
            load();
        }, [load])
    );

    return { rows, loading, reload: load };
}
