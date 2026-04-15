import { useState, useMemo } from 'react';
import animusData from '@/data/animus.json';
import type { Animus, Affinity, Tier } from '@/types';
import { AnimusCard } from '@/components/AnimusCard';
import { SPEED_BREAKPOINTS } from '@/data/constants';

const allAnimus = animusData as Animus[];
const TIERS: Tier[]     = ['SSS', 'SS', 'S', 'A'];
const AFFINITIES: Affinity[] = ['Reason', 'Hollow', 'Odd', 'Constant', 'Disorder'];

export default function TierList() {
  const [affinityFilter, setAffinityFilter] = useState<Affinity | null>(null);
  const [speedFilter,    setSpeedFilter]    = useState<number | null>(null);

  const filtered = useMemo(() => {
    return allAnimus.filter((a) => {
      if (affinityFilter && a.affinity !== affinityFilter) return false;
      if (speedFilter    && a.baseSpeed < speedFilter)     return false;
      return true;
    });
  }, [affinityFilter, speedFilter]);

  const byTier = useMemo(() => {
    const map = new Map<Tier, Animus[]>();
    for (const tier of TIERS) map.set(tier, []);
    for (const a of filtered) map.get(a.tier)?.push(a);
    return map;
  }, [filtered]);

  return (
    <div>
      <div className="page-header">
        <h1>Animus Tier List</h1>
        <p>March 2026 meta · {filtered.length} units</p>
      </div>

      <div className="filter-bar">
        <div className="filter-bar__group">
          <button
            className={`filter-btn${affinityFilter === null ? ' filter-btn--active' : ''}`}
            onClick={() => setAffinityFilter(null)}
          >
            All
          </button>
          {AFFINITIES.map((aff) => (
            <button
              key={aff}
              className={`filter-btn filter-btn--${aff}${affinityFilter === aff ? ' filter-btn--active' : ''}`}
              onClick={() => setAffinityFilter(affinityFilter === aff ? null : aff)}
            >
              <img
                src={`/assets/affinities/${aff.toUpperCase()}.webp`}
                alt={aff}
                style={{ width: 14, height: 14, objectFit: 'contain' }}
              />
              {aff}
            </button>
          ))}
        </div>

        <div className="filter-bar__divider" />

        <div className="filter-bar__group">
          <button
            className={`filter-btn${speedFilter === null ? ' filter-btn--active' : ''}`}
            onClick={() => setSpeedFilter(null)}
          >
            All SPD
          </button>
          {SPEED_BREAKPOINTS.map((bp) => (
            <button
              key={bp.threshold}
              className={`filter-btn ${bp.cssClass}${speedFilter === bp.threshold ? ' filter-btn--active' : ''}`}
              onClick={() => setSpeedFilter(speedFilter === bp.threshold ? null : bp.threshold)}
            >
              {bp.threshold}+ <span style={{ fontSize: 10, opacity: 0.7 }}>{bp.label}</span>
            </button>
          ))}
        </div>
      </div>

      {TIERS.map((tier) => {
        const units = byTier.get(tier) ?? [];
        if (units.length === 0) return null;
        return (
          <div key={tier} className="tier-section">
            <div className="tier-section__header">
              <span className={`tier-badge tier-badge--${tier}`}>{tier}</span>
              <span className="tier-section__label">
                {tier === 'SSS' ? 'Meta Dominant' :
                 tier === 'SS'  ? 'Top Tier' :
                 tier === 'S'   ? 'High Value' : 'Viable'}
              </span>
              <span className="tier-section__count">{units.length} units</span>
            </div>
            <div className="tier-section__grid">
              {units.map((a) => (
                <AnimusCard key={a.id} animus={a} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
