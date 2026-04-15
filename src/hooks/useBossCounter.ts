import { useMemo } from 'react';
import animusData from '@/data/animus.json';
import bossData   from '@/data/bosses.json';
import type { Animus, Boss } from '@/types';

const allAnimus = animusData as Animus[];
const allBosses = bossData   as Boss[];

export function useBossCounter(bossId: string | null) {
  return useMemo(() => {
    if (!bossId) return null;
    const boss = allBosses.find((b) => b.id === bossId);
    if (!boss) return null;

    const counterUnits = allAnimus.filter((a) =>
      boss.recommendedCounters.includes(a.id)
    );

    const advantageUnits = allAnimus.filter(
      (a) => a.affinity === boss.advantageAffinity && !boss.recommendedCounters.includes(a.id)
    );

    return { boss, counterUnits, advantageUnits };
  }, [bossId]);
}

export { allAnimus, allBosses };
