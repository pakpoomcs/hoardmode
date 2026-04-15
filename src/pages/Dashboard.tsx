import { useState, useEffect } from 'react';
import { FARM_SCHEDULE, SPEED_BREAKPOINTS } from '@/data/constants';
import modulesData from '@/data/modules.json';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MAX_REFILLS = 10;
const LS_REFILL_KEY = 'hoardmode_refills';

interface RefillState { date: string; used: number; }

function loadRefills(): RefillState {
  try {
    const raw = localStorage.getItem(LS_REFILL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as RefillState;
      const today = new Date().toDateString();
      if (parsed.date === today) return parsed;
    }
  } catch { /* ignore */ }
  return { date: new Date().toDateString(), used: 0 };
}

const LATTICE_PRIORITIES = [
  { priority: 1, name: 'Rilmocha',             detail: 'S3 — One-Shot Mechanic' },
  { priority: 1, name: 'Marvell',              detail: 'S3 — SPD- / Eff Res-' },
  { priority: 2, name: 'Lily',                 detail: 'S1 — Support Accuracy' },
  { priority: 2, name: 'Rahu',                 detail: 'S2 — DEF Scaling (Bulwark)' },
  { priority: 2, name: 'Plume',                detail: 'S1 — Speed Boost' },
];

export default function Dashboard() {
  const today      = new Date();
  const dayIndex   = today.getDay();
  const dayName    = DAYS[dayIndex];
  const schedule   = FARM_SCHEDULE[dayIndex];
  const isSpeedDay = schedule.modules.includes('swift-rush');

  const [refills, setRefills] = useState<RefillState>(loadRefills);

  useEffect(() => {
    localStorage.setItem(LS_REFILL_KEY, JSON.stringify(refills));
  }, [refills]);

  function addRefill() {
    if (refills.used >= MAX_REFILLS) return;
    setRefills((r) => ({ ...r, used: r.used + 1 }));
  }

  function removeRefill() {
    if (refills.used <= 0) return;
    setRefills((r) => ({ ...r, used: r.used - 1 }));
  }

  const remaining = MAX_REFILLS - refills.used;
  const todayModules = modulesData.filter((m) => schedule.modules.includes(m.id));

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>{dayName}, {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="dashboard-grid">
        {/* Today's Farm */}
        <div className="farm-today">
          <div className="farm-today__day">Today's Farm</div>
          <div className="farm-today__label">{schedule.label}</div>
          <div className="farm-today__modules">
            {todayModules.map((m) => (
              <span
                key={m.id}
                className={`module-chip${isSpeedDay ? ' module-chip--priority' : ''}`}
              >
                {m.name}
              </span>
            ))}
          </div>
          {isSpeedDay && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>
              Speed day — highest priority. Hit 185+ SPD breakpoint first.
            </p>
          )}
          {todayModules[0] && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
              {todayModules[0].pvpDetail}
            </p>
          )}
        </div>

        {/* Refill Tracker */}
        <div className="refill-tracker">
          <div className="refill-tracker__label">Daily Refills Used</div>
          <div className="refill-tracker__count">
            {refills.used} <span>/ {MAX_REFILLS}</span>
          </div>
          <div style={{ width: '100%', height: 4, background: 'var(--bg-raised)', borderRadius: 4, marginBottom: 14 }}>
            <div style={{
              height: '100%',
              borderRadius: 4,
              background: remaining > 3 ? 'var(--color-hollow)' : remaining > 0 ? '#ffd700' : 'var(--color-reason)',
              width: `${(refills.used / MAX_REFILLS) * 100}%`,
              transition: 'width 0.2s',
            }} />
          </div>
          <div className="refill-tracker__buttons">
            <button className="refill-btn" onClick={removeRefill} disabled={refills.used === 0}>−</button>
            <button className="refill-btn" onClick={addRefill}    disabled={refills.used === MAX_REFILLS}>+</button>
          </div>
          {remaining === 0 && (
            <p style={{ fontSize: 12, color: 'var(--color-reason)', marginTop: 10 }}>All refills used. Resets at midnight.</p>
          )}
        </div>
      </div>

      {/* Speed Breakpoints */}
      <div className="card">
        <div className="card__label">Speed Breakpoints</div>
        <table className="spd-table">
          <thead>
            <tr>
              <th>Threshold</th>
              <th>Tier</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {SPEED_BREAKPOINTS.map((bp) => (
              <tr key={bp.threshold}>
                <td className={bp.cssClass} style={{ fontWeight: 700 }}>{bp.threshold}+</td>
                <td style={{ fontWeight: 600 }}>{bp.label}</td>
                <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{bp.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lattice Priorities */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card__label">Lattice Investment Priorities</div>
        <ul className="lattice-list">
          {LATTICE_PRIORITIES.map((item) => (
            <li key={item.name} className="lattice-item">
              <span className={`lattice-item__priority lattice-item__priority--${item.priority}`}>
                P{item.priority}
              </span>
              <div>
                <div className="lattice-item__name">{item.name}</div>
                <div className="lattice-item__detail">{item.detail}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
