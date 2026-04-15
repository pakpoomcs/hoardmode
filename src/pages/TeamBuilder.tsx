import { useState } from 'react';
import { useBossCounter, allBosses } from '@/hooks/useBossCounter';
import { AnimusCard } from '@/components/AnimusCard';
import { AffinityBadge } from '@/components/AffinityBadge';
import type { Animus } from '@/types';

const AFFINITY_COLORS: Record<string, string> = {
  Reason:   '#e84040',
  Hollow:   '#3cbb5a',
  Odd:      '#4a90d9',
  Constant: '#c8c8d8',
  Disorder: '#9b59b6',
};

function AffinityTriangle() {
  const cx = 140, cy = 120, r = 80;
  const cycle = ['Reason', 'Hollow', 'Odd'] as const;
  const pts = cycle.map((_, i) => {
    const angle = (i * 120 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  return (
    <div className="affinity-triangle">
      <div className="card__label" style={{ marginBottom: 12 }}>Affinity Cycle</div>
      <svg viewBox="0 0 280 240">
        {/* Cycle arrows */}
        {cycle.map((aff, i) => {
          const from = pts[i];
          const to   = pts[(i + 1) % 3];
          const mx   = (from.x + to.x) / 2;
          const my   = (from.y + to.y) / 2;
          const dx   = to.x - from.x, dy = to.y - from.y;
          const len  = Math.sqrt(dx * dx + dy * dy);
          const nx   = -dy / len * 12, ny = dx / len * 12;
          return (
            <g key={aff}>
              <path
                d={`M ${from.x} ${from.y} Q ${mx + nx} ${my + ny} ${to.x} ${to.y}`}
                fill="none"
                stroke={AFFINITY_COLORS[aff]}
                strokeWidth={2}
                strokeOpacity={0.6}
                markerEnd={`url(#arrow-${aff})`}
              />
              <defs>
                <marker id={`arrow-${aff}`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill={AFFINITY_COLORS[aff]} />
                </marker>
              </defs>
            </g>
          );
        })}
        {/* Nodes */}
        {cycle.map((aff, i) => (
          <g key={`node-${aff}`}>
            <circle cx={pts[i].x} cy={pts[i].y} r={22} fill={AFFINITY_COLORS[aff]} fillOpacity={0.15} stroke={AFFINITY_COLORS[aff]} strokeWidth={1.5} />
            <text x={pts[i].x} y={pts[i].y + 4} textAnchor="middle" fill={AFFINITY_COLORS[aff]} fontSize={11} fontWeight={700}>{aff}</text>
          </g>
        ))}
        {/* Constant and Disorder */}
        <line x1="90" y1="205" x2="190" y2="205" stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="4 3" />
        <g>
          <circle cx={80} cy={208} r={18} fill={AFFINITY_COLORS['Constant']} fillOpacity={0.1} stroke={AFFINITY_COLORS['Constant']} strokeWidth={1} />
          <text x={80} y={212} textAnchor="middle" fill={AFFINITY_COLORS['Constant']} fontSize={9} fontWeight={700}>Constant</text>
        </g>
        <g>
          <circle cx={200} cy={208} r={18} fill={AFFINITY_COLORS['Disorder']} fillOpacity={0.1} stroke={AFFINITY_COLORS['Disorder']} strokeWidth={1} />
          <text x={200} y={212} textAnchor="middle" fill={AFFINITY_COLORS['Disorder']} fontSize={9} fontWeight={700}>Disorder</text>
        </g>
        <text x={140} y={230} textAnchor="middle" fill="var(--text-muted)" fontSize={9}>opposed · neutral to cycle</text>
      </svg>
    </div>
  );
}

export default function TeamBuilder() {
  const [selectedBoss, setSelectedBoss] = useState<string>('');
  const [team, setTeam]                 = useState<(Animus | null)[]>([null, null, null, null]);
  const result = useBossCounter(selectedBoss || null);

  function addToTeam(unit: Animus) {
    setTeam((prev) => {
      if (prev.some((s) => s?.id === unit.id)) return prev;
      const slot = prev.findIndex((s) => s === null);
      if (slot === -1) return prev;
      const next = [...prev];
      next[slot] = unit;
      return next;
    });
  }

  function removeFromTeam(index: number) {
    setTeam((prev) => { const next = [...prev]; next[index] = null; return next; });
  }

  return (
    <div>
      <div className="page-header">
        <h1>Team Builder</h1>
        <p>Select a boss to get counter picks, then assemble your team.</p>
      </div>

      <div className="team-builder">
        {/* Left panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="boss-selector card">
            <label>Select Boss</label>
            <select value={selectedBoss} onChange={(e) => setSelectedBoss(e.target.value)}>
              <option value="">— choose a boss —</option>
              {allBosses.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <AffinityTriangle />
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Team slots */}
          <div className="card">
            <div className="card__label">Your Team</div>
            <div className="team-slots">
              {team.map((unit, i) => (
                <div key={i} className={`team-slot${unit ? ' team-slot--filled' : ''}`}>
                  {unit ? (
                    <>
                      <img src={`/assets/animus/${unit.imageFile}`} alt={unit.name} />
                      <button className="team-slot__remove" onClick={() => removeFromTeam(i)}>×</button>
                    </>
                  ) : (
                    <span>Slot {i + 1}</span>
                  )}
                </div>
              ))}
            </div>
            {team.some(Boolean) && (
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                {team.filter(Boolean).map((u) => u && (
                  <span key={u.id} style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    {u.name} · <AffinityBadge affinity={u.affinity} showIcon={false} />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Counter recommendations */}
          <div className="counter-result">
            {!result ? (
              <div className="counter-result__empty">Select a boss to see recommended counters.</div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{result.boss.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                      Bring <strong style={{ color: AFFINITY_COLORS[result.boss.advantageAffinity] }}>{result.boss.advantageAffinity}</strong> units
                      · Needs <strong style={{ color: 'var(--accent)' }}>{result.boss.requiredUtility}</strong>
                      {result.boss.immuneToDoT && <span style={{ color: 'var(--color-reason)', marginLeft: 8 }}>· DoT Immune</span>}
                    </div>
                  </div>
                  <AffinityBadge affinity={result.boss.advantageAffinity} />
                </div>

                <div className="card__label">Priority Counters</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10, marginBottom: 16 }}>
                  {result.counterUnits.map((u) => (
                    <AnimusCard key={u.id} animus={u} onClick={addToTeam} selected={team.some((s) => s?.id === u.id)} />
                  ))}
                </div>

                {result.advantageUnits.length > 0 && (
                  <>
                    <div className="card__label">Advantage Affinity Pool</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
                      {result.advantageUnits.slice(0, 8).map((u) => (
                        <AnimusCard key={u.id} animus={u} onClick={addToTeam} selected={team.some((s) => s?.id === u.id)} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
