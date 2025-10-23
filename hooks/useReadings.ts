import { useCallback, useEffect, useState } from 'react';
import { createReading, deleteReading, listReadings, updateReading } from '../db/dao';
import { Reading, ReadingInput } from '../types/db';

export const useReadings = (userId?: string) => {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const rows = await listReadings(userId);
    setReadings(rows);
    setLoading(false);
  }, [userId]);

  const add = useCallback(
    async (input: Omit<ReadingInput, 'userId'>) => {
      if (!userId) return null;
      const optimistic = {
        ...input,
        userId,
        id: `temp-${Date.now()}`,
      } as Reading;
      setReadings((prev) => [...prev, optimistic]);
      try {
        const created = await createReading({ ...input, userId });
        if (created) {
          setReadings((prev) => prev.filter((r) => r.id !== optimistic.id).concat(created));
        } else {
          setReadings((prev) => prev.filter((r) => r.id !== optimistic.id));
        }
        return created;
      } catch (error) {
        setReadings((prev) => prev.filter((r) => r.id !== optimistic.id));
        throw error;
      }
    },
    [userId],
  );

  const update = useCallback(
    async (id: string, partial: Partial<Reading>) => {
      setReadings((prev) => prev.map((r) => (r.id === id ? { ...r, ...partial } : r)));
      const result = await updateReading(id, partial);
      if (result) {
        setReadings((prev) => prev.map((r) => (r.id === id ? result : r)));
      }
      return result;
    },
    [],
  );

  const remove = useCallback(async (id: string) => {
    setReadings((prev) => prev.filter((r) => r.id !== id));
    await deleteReading(id);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { readings, loading, refresh, add, update, remove };
};
