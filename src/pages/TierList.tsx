import { useState, useMemo } from 'react';
import animusData from '@/data/animus.json';
import type { Animus, Affinity, Tier } from '@/types';
import { AnimusCard } from '@/components/AnimusCard';
import { SPEED_BREAKPOINTS } from '@/data/constants';

const allAnimus = animusData as Animus[];
const TIERS: Tier[] = ['SSS', 'SS', 'S', 'A'];
const AFFINITIES: Affinity[] = ['Reason', 'Hollow', 'Odd', 'Constant', 'Disorder'];

const TIER_LABELS: Record<Tier, string> = {
  SSS: 'Meta Dominant',
  SS:  'Top Tier',
  S:   'High Value',
  A:   'Viable',
};

export default function TierList() {
  const [affinityFilter, setAffinityFilter] = useState<Affinity | null>(null);
  const [speedFilter,    setSpeedFilter]    = useState<number | null>(null);

  const filtered = useMemo(() => allAnimus.filter((a) => {
    if (affinityFilter && a.affinity !== affinityFilter) return false;
    if (speedFilter    && a.baseSpeed < speedFilter)     return false;
    return true;
  }), [affinityFilter, speedFilter]);

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
        <p>March 2026 meta · {filtered.length} of {allAnimus.length} units shown</p>
      </div>

      <div className="filter-bar">
        <div className="filter-bar__group">
          <button
            className={`filter-btn${!affinityFilter ? ' filter-btn--active' : ''}`}
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
              <img src={`/assets/affinities/${aff.toUpperCase()}.webp`} alt={aff} />
              {aff}
            </button>
          ))}
        </div>

        <div className="filter-bar__divider" />

        <div className="filter-bar__group">
          <button
            className={`filter-btn${!speedFilter ? ' filter-btn--active' : ''}`}
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
              {bp.threshold}+
            </button>
          ))}
        </div>
      </div>

      {TIERS.map((tier) => {
        const units = byTier.get(tier) ?? [];
        if (units.length === 0) return null;
        return (
          <div key={tier} className="tier-row">
            <div className={`tier-row__label tier-row__label--${tier}`}>
              <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: 3, fontSize: 13 }}>
                {tier}
              </div>
            </div>
            <div className="tier-row__units">
              {units.map((a) => (
                <AnimusCard key={a.id} animus={a} showTier={false} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
        {TIERS.map((tier) => (
          <div key={tier} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={`tier-badge tier-badge--${tier}`}>{tier}</span>
            <span style={{ fontSize: 12, color: 'var(--tx-2)' }}>{TIER_LABELS[tier]}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--tx-3)', marginLeft: 8 }}>
          <span style={{ color: '#f5c842', fontWeight: 700, fontSize: 11 }}>SP</span> Shadow Print required
        </div>
      </div>
    </div>
  );
}
