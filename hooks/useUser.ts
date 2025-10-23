import { useCallback, useEffect, useState } from 'react';
import { getUser, upsertUser } from '../db/dao';
import { UserProfile } from '../types/db';

export const useUser = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const profile = await getUser();
    setUser(profile);
    setLoading(false);
  }, []);

  const update = useCallback(
    async (partial: Partial<UserProfile>) => {
      const updated = await upsertUser(partial);
      setUser(updated);
      return updated;
    },
    [],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { user, loading, refresh, update };
};
