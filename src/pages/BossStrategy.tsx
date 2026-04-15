import bossData   from '@/data/bosses.json';
import animusData from '@/data/animus.json';
import type { Boss, Animus } from '@/types';
import { AffinityBadge } from '@/components/AffinityBadge';

const allBosses = bossData   as Boss[];
const allAnimus = animusData as Animus[];

function CounterChip({ animusId }: { animusId: string }) {
  const unit = allAnimus.find((a) => a.id === animusId);
  if (!unit) return null;
  return (
    <div className="counter-chip">
      <img src={`/assets/animus/${unit.imageFile}`} alt={unit.name} />
      <div>
        <div style={{ fontWeight: 700, fontSize: 12 }}>{unit.name}</div>
        <div style={{ fontSize: 10, color: 'var(--tx-3)', marginTop: 1 }}>{unit.primaryRole}</div>
      </div>
    </div>
  );
}

export default function BossStrategy() {
  return (
    <div>
      <div className="page-header">
        <h1>Boss Strategy</h1>
        <p>Hell IV &amp; Inferno counter guides</p>
      </div>

      {allBosses.map((boss) => (
        <div key={boss.id} className="boss-card">
          <div className="boss-card__header">
            <div>
              <div className="boss-card__name">{boss.name}</div>
              <div className="boss-card__badges">
                <AffinityBadge affinity={boss.affinity} />
                {boss.immuneToDoT && <span className="dot-immune-badge">DoT Immune</span>}
                <span className="utility-badge">Needs {boss.requiredUtility}</span>
                {boss.difficultyTiers.map((d) => (
                  <span key={d} className="difficulty-badge">{d}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: 'var(--tx-3)', marginBottom: 5 }}>Advantage</div>
              <AffinityBadge affinity={boss.advantageAffinity} />
            </div>
          </div>

          <div className="boss-card__body">
            <div className="boss-card__section">
              <div className="boss-card__section-label">Mechanics</div>
              <ul className="boss-card__mechanics">
                {boss.mechanics.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
            <div className="boss-card__section">
              <div className="boss-card__section-label">Recommended Counters</div>
              <div className="boss-card__counters">
                {boss.recommendedCounters.map((id) => (
                  <CounterChip key={id} animusId={id} />
                ))}
              </div>
            </div>
          </div>

          <div className="boss-card__notes">{boss.notes}</div>
        </div>
      ))}
    </div>
  );
}
