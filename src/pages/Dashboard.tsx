import { useState, useMemo } from 'react';
import animusData from '@/data/animus.json';
import type { Animus, Affinity, Tier } from '@/types';
import { AnimusCard } from '@/components/AnimusCard';
import { AnimusDetail } from '@/components/AnimusDetail';
import { FARM_SCHEDULE, SPEED_BREAKPOINTS } from '@/data/constants';
import modulesData from '@/data/modules.json';

const allAnimus = animusData as Animus[];
const AFFINITIES: Affinity[] = ['Reason', 'Hollow', 'Odd', 'Constant', 'Disorder'];
const TIERS: Tier[] = ['SSS', 'SS', 'S', 'A'];
const MAX_REFILLS = 10;
const LS_REFILL_KEY = 'hoardmode_refills';

interface RefillState { date: string; used: number; }

function loadRefills(): RefillState {
  try {
    const raw = localStorage.getItem(LS_REFILL_KEY);
    if (raw) {
      const p = JSON.parse(raw) as RefillState;
      if (p.date === new Date().toDateString()) return p;
    }
  } catch { /* ignore */ }
  const fresh = { date: new Date().toDateString(), used: 0 };
  localStorage.setItem(LS_REFILL_KEY, JSON.stringify(fresh));
  return fresh;
}

export default function Dashboard() {
  // ── Refill state ──────────────────────────────────────────────────────────
  const [refills, setRefills] = useState<RefillState>(loadRefills);

  function addRefill() {
    setRefills((r) => {
      const next = { ...r, used: Math.min(r.used + 1, MAX_REFILLS) };
      localStorage.setItem(LS_REFILL_KEY, JSON.stringify(next));
      return next;
    });
  }
  function subRefill() {
    setRefills((r) => {
      const next = { ...r, used: Math.max(r.used - 1, 0) };
      localStorage.setItem(LS_REFILL_KEY, JSON.stringify(next));
      return next;
    });
  }

  // ── Farm schedule ─────────────────────────────────────────────────────────
  const today      = new Date();
  const dayIndex   = today.getDay();
  const schedule   = FARM_SCHEDULE[dayIndex];
  const isSpeedDay = schedule.modules.includes('swift-rush');
  const todayMods  = modulesData.filter((m) => schedule.modules.includes(m.id));

  // ── Filters ───────────────────────────────────────────────────────────────
  const [search,         setSearch]         = useState('');
  const [affinityFilter, setAffinityFilter] = useState<Affinity | null>(null);
  const [tierFilter,     setTierFilter]     = useState<Tier | null>(null);
  const [speedFilter,    setSpeedFilter]    = useState<number | null>(null);
  const [selected,       setSelected]       = useState<Animus | null>(null);
  // keep last animus so the panel content doesn't vanish during close transition
  const [panelAnimus,    setPanelAnimus]    = useState<Animus | null>(null);

  function handleCardClick(a: Animus) {
    if (selected?.id === a.id) {
      setSelected(null);          // toggle off
    } else {
      setSelected(a);
      setPanelAnimus(a);
    }
  }

  const filtered = useMemo(() => allAnimus.filter((a) => {
    if (affinityFilter && a.affinity !== affinityFilter) return false;
    if (tierFilter     && a.tier     !== tierFilter)     return false;
    if (speedFilter    && a.baseSpeed < speedFilter)     return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [affinityFilter, tierFilter, speedFilter, search]);

  const remaining = MAX_REFILLS - refills.used;
  const refillPct = (refills.used / MAX_REFILLS) * 100;
  const barColor  = remaining > 3 ? 'var(--c-hollow)' : remaining > 0 ? '#f5c842' : 'var(--c-reason)';

  return (
    <div>
      {/* ── Top summary strip ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
        {/* Today's farm */}
        <div className="farm-today">
          <div className="farm-today__day">Today's Farm</div>
          <div className="farm-today__label">{schedule.label}</div>
          <div className="farm-today__modules">
            {todayMods.map((m) => (
              <span key={m.id} className={`module-chip${isSpeedDay ? ' module-chip--priority' : ''}`}>
                {m.name}
              </span>
            ))}
          </div>
          {todayMods[0] && (
            <p style={{ fontSize: 11, color: 'var(--tx-3)', marginTop: 8, lineHeight: 1.5 }}>
              {todayMods[0].pvpDetail}
            </p>
          )}
        </div>

        {/* Refill tracker */}
        <div className="refill-tracker">
          <div className="refill-tracker__label">Daily Refills Used</div>
          <div className="refill-tracker__count">
            {refills.used}<span> / {MAX_REFILLS}</span>
          </div>
          <div className="refill-progress">
            <div className="refill-progress__bar" style={{ width: `${refillPct}%`, background: barColor }} />
          </div>
          <div className="refill-tracker__buttons">
            <button className="refill-btn" onClick={subRefill} disabled={refills.used === 0}>−</button>
            <button className="refill-btn" onClick={addRefill} disabled={refills.used === MAX_REFILLS}>+</button>
          </div>
        </div>
      </div>

      {/* ── Roster header ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.4 }}>Roster</h2>
          <p style={{ fontSize: 12, color: 'var(--tx-3)', marginTop: 2 }}>
            {filtered.length} of {allAnimus.length} units
          </p>
        </div>

        {/* Search */}
        <input
          type="search"
          placeholder="Search unit…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '7px 14px',
            background: 'var(--bg-surf)',
            border: '1px solid var(--border-md)',
            borderRadius: 20,
            color: 'var(--tx-1)',
            fontSize: 13,
            width: 180,
            outline: 'none',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onBlur={(e)  => (e.currentTarget.style.borderColor = 'var(--border-md)')}
        />
      </div>

      {/* ── Filter bar ───────────────────────────────────────────────────── */}
      <div className="filter-bar" style={{ marginBottom: 20 }}>
        {/* Affinity */}
        <div className="filter-bar__group">
          <button
            className={`filter-btn${!affinityFilter ? ' filter-btn--active' : ''}`}
            onClick={() => setAffinityFilter(null)}
          >All</button>
          {AFFINITIES.map((aff) => (
            <button
              key={aff}
              className={`filter-btn filter-btn--${aff}${affinityFilter === aff ? ' filter-btn--active' : ''}`}
              onClick={() => setAffinityFilter(affinityFilter === aff ? null : aff)}
            >
              <img src={`/assets/affinities/${aff.toUpperCase()}.webp`} alt={aff} style={{ width: 13, height: 13 }} />
              {aff}
            </button>
          ))}
        </div>

        <div className="filter-bar__divider" />

        {/* Tier */}
        <div className="filter-bar__group">
          {TIERS.map((tier) => (
            <button
              key={tier}
              className={`filter-btn${tierFilter === tier ? ' filter-btn--active' : ''}`}
              onClick={() => setTierFilter(tierFilter === tier ? null : tier)}
              style={{ fontWeight: 800 }}
            >
              <span className={`tier-badge tier-badge--${tier}`} style={{ fontSize: 9, width: 28, height: 16 }}>{tier}</span>
            </button>
          ))}
        </div>

        <div className="filter-bar__divider" />

        {/* Speed */}
        <div className="filter-bar__group">
          {SPEED_BREAKPOINTS.map((bp) => (
            <button
              key={bp.threshold}
              className={`filter-btn ${bp.cssClass}${speedFilter === bp.threshold ? ' filter-btn--active' : ''}`}
              onClick={() => setSpeedFilter(speedFilter === bp.threshold ? null : bp.threshold)}
            >
              {bp.threshold}+ SPD
            </button>
          ))}
        </div>

        {/* Clear */}
        {(affinityFilter || tierFilter || speedFilter || search) && (
          <button
            className="filter-btn"
            onClick={() => { setAffinityFilter(null); setTierFilter(null); setSpeedFilter(null); setSearch(''); }}
            style={{ color: 'var(--c-reason)', borderColor: 'rgba(224,82,82,.3)' }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* ── Roster grid with inline detail panel ────────────────────────── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--tx-3)', fontSize: 14 }}>
          No units match your filters.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))',
          gap: 8,
        }}>
          {filtered.map((a) => (
            <>
              <AnimusCard
                key={a.id}
                animus={a}
                showTier
                onClick={handleCardClick}
                selected={selected?.id === a.id}
              />
              {selected?.id === a.id && panelAnimus && (
                <div key={`detail-${a.id}`} className="animus-detail-wrap">
                  <AnimusDetail
                    animus={panelAnimus}
                    onClose={() => setSelected(null)}
                  />
                </div>
              )}
            </>
          ))}
        </div>
      )}
    </div>
  );
}
