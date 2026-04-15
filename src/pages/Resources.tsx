import { useState } from 'react';
import { getSpeedTier, rollsToNextTier, SPEED_BREAKPOINTS } from '@/data/constants';

const STAMINA_PER_REFILL = 60;
const MAX_REFILLS        = 10;
const BASE_STAMINA       = 120; // natural regen
const COST_PER_RUN       = 30;

const LATTICE_PRIORITIES = [
  { priority: 1, name: 'Rilmocha',            detail: 'S3 — One-Shot Mechanic. Core to her damage identity.' },
  { priority: 1, name: 'Marvell',             detail: 'S3 — SPD- / Eff Res-. Disrupts enemy turn order.' },
  { priority: 2, name: 'Lily',                detail: 'S1 — Accuracy Buff. Required for reliable debuff application.' },
  { priority: 2, name: 'Rahu',                detail: 'S2 — DEF Scaling. Pair with full Bulwark set.' },
  { priority: 2, name: 'Plume',               detail: 'S1 — Speed Boost. Ensures Turn 1 priority.' },
];

export default function Resources() {
  const [currentSpeed, setCurrentSpeed] = useState<string>('');
  const [refillsUsed,  setRefillsUsed]  = useState<number>(10);
  const [doubleEvent,  setDoubleEvent]  = useState<boolean>(false);
  const [latticeNotes, setLatticeNotes] = useState<Record<string, string>>({});

  const parsedSpeed = parseInt(currentSpeed, 10);
  const speedValid  = !isNaN(parsedSpeed) && parsedSpeed > 0 && parsedSpeed < 300;
  const speedTier   = speedValid ? getSpeedTier(parsedSpeed)   : null;
  const nextTier    = speedValid ? rollsToNextTier(parsedSpeed) : null;

  const totalStamina   = BASE_STAMINA + refillsUsed * STAMINA_PER_REFILL;
  const runsPerDay     = Math.floor(totalStamina / COST_PER_RUN);
  const effectiveRuns  = doubleEvent ? runsPerDay * 2 : runsPerDay;

  return (
    <div>
      <div className="page-header">
        <h1>Resource Tools</h1>
        <p>Speed calculator, stamina planner, and lattice investment tracker.</p>
      </div>

      <div className="resource-grid">
        {/* Speed Calculator */}
        <div className="calc-card">
          <h3>Speed Substat Calculator</h3>
          <div className="input-group">
            <label>Current Speed</label>
            <input
              type="number"
              placeholder="e.g. 163"
              value={currentSpeed}
              onChange={(e) => setCurrentSpeed(e.target.value)}
              min={1}
              max={299}
            />
          </div>

          {speedValid && speedTier && (
            <>
              <div className="calc-result" style={{ marginBottom: 12 }}>
                <div className={`calc-result__value ${speedTier.cssClass}`}>{parsedSpeed}</div>
                <div className="calc-result__label">{speedTier.label} · {speedTier.description}</div>
              </div>

              {nextTier ? (
                <div className="calc-result" style={{ background: 'var(--bg-overlay)' }}>
                  <div className="calc-result__value" style={{ fontSize: 20 }}>+{nextTier.rolls} rolls</div>
                  <div className="calc-result__label">
                    to reach {nextTier.target} SPD ({nextTier.tierLabel})
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 11 }}>
                      Each substat roll ≈ +3 SPD
                    </span>
                  </div>
                </div>
              ) : (
                <div className="calc-result" style={{ background: 'rgba(255,215,0,0.08)' }}>
                  <div className="calc-result__value spd-t1">T1 Opener</div>
                  <div className="calc-result__label">185+ SPD — maximum breakpoint achieved</div>
                </div>
              )}

              <div style={{ marginTop: 14 }}>
                {SPEED_BREAKPOINTS.map((bp) => (
                  <div key={bp.threshold} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '6px 0', borderBottom: '1px solid var(--border)',
                    opacity: parsedSpeed >= bp.threshold ? 1 : 0.4,
                  }}>
                    <span className={`${bp.cssClass}`} style={{ fontWeight: 700, width: 32 }}>{bp.threshold}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{bp.label}</span>
                    {parsedSpeed >= bp.threshold && (
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--color-hollow)' }}>✓</span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Stamina Planner */}
        <div className="calc-card">
          <h3>Stamina Planner</h3>

          <div className="toggle-row">
            <label>2× Drop Event (Blessing Galore)</label>
            <input
              type="checkbox"
              className="toggle"
              checked={doubleEvent}
              onChange={(e) => setDoubleEvent(e.target.checked)}
            />
          </div>

          <div className="input-group">
            <label>Refills Used Today (max {MAX_REFILLS})</label>
            <input
              type="range"
              min={0}
              max={MAX_REFILLS}
              value={refillsUsed}
              onChange={(e) => setRefillsUsed(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {refillsUsed} / {MAX_REFILLS} refills · {totalStamina} stamina
            </span>
          </div>

          <div className="calc-result">
            <div className="calc-result__value" style={{ color: doubleEvent ? '#ffd700' : 'var(--text-primary)' }}>
              {effectiveRuns}
            </div>
            <div className="calc-result__label">
              effective runs/day{doubleEvent ? ' (2× event)' : ''}
              <span style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)' }}>
                {runsPerDay} runs × {doubleEvent ? '2× drop rate' : '1× drop rate'} · {COST_PER_RUN} stamina/run
              </span>
            </div>
          </div>

          <div style={{ marginTop: 14, padding: '12px', background: 'var(--bg-raised)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Protocol:</strong> Save Mental Stabilizers and only burn during
            2× events like Blessing Galore for maximum module efficiency.
            {doubleEvent && <span style={{ color: '#ffd700', display: 'block', marginTop: 4 }}>
              ★ 2× event active — now is the time to burn saved Stabilizers.
            </span>}
          </div>
        </div>
      </div>

      {/* Lattice Investment Log */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card__label">Lattice Investment Log</div>
        <ul className="lattice-list">
          {LATTICE_PRIORITIES.map((item) => (
            <li key={item.name} className="lattice-item">
              <span className={`lattice-item__priority lattice-item__priority--${item.priority}`}>P{item.priority}</span>
              <div style={{ flex: 1 }}>
                <div className="lattice-item__name">{item.name}</div>
                <div className="lattice-item__detail">{item.detail}</div>
              </div>
              <input
                type="text"
                placeholder="notes..."
                value={latticeNotes[item.name] ?? ''}
                onChange={(e) => setLatticeNotes((n) => ({ ...n, [item.name]: e.target.value }))}
                style={{
                  background: 'var(--bg-overlay)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                  fontSize: 12, padding: '4px 8px', width: 160,
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
