import type { Animus } from '@/types';
import { AffinityBadge } from './AffinityBadge';
import { SpeedIndicator } from './SpeedIndicator';
import { AFFINITY_CYCLE, AFFINITY_ADVANTAGE, AFFINITY_DISADVANTAGE } from '@/data/constants';

interface Props {
  animus: Animus;
  onClose: () => void;
}

const TIER_DESC: Record<string, string> = {
  SSS: 'Meta Dominant',
  SS:  'Top Tier',
  S:   'High Value',
  A:   'Viable',
};

export function AnimusDetail({ animus, onClose }: Props) {
  const beats    = AFFINITY_CYCLE[animus.affinity];          // what this unit is strong against
  const weakTo   = Object.entries(AFFINITY_CYCLE)            // what beats this unit
    .find(([, v]) => v === animus.affinity)?.[0] ?? null;

  return (
    <div className="animus-detail">
      {/* Close */}
      <button className="animus-detail__close" onClick={onClose} aria-label="Close">✕</button>

      {/* Portrait */}
      <div className="animus-detail__portrait-wrap">
        <img
          src={`/assets/animus/${animus.imageFile}`}
          alt={animus.name}
          className="animus-detail__portrait"
        />
        <div className="animus-detail__portrait-gradient" />

        {/* Name over portrait */}
        <div className="animus-detail__name-block">
          <div className="animus-detail__name">{animus.name}</div>
          <div className="animus-detail__badges">
            <span className={`tier-badge tier-badge--${animus.tier}`}>{animus.tier}</span>
            <AffinityBadge affinity={animus.affinity} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="animus-detail__body">

        {/* Tier + speed row */}
        <div className="animus-detail__row">
          <div className="animus-detail__stat">
            <div className="animus-detail__stat-label">Tier</div>
            <div className="animus-detail__stat-value">{TIER_DESC[animus.tier]}</div>
          </div>
          <div className="animus-detail__stat">
            <div className="animus-detail__stat-label">Base Speed</div>
            <div className="animus-detail__stat-value">
              <SpeedIndicator speed={animus.baseSpeed} showGap />
            </div>
          </div>
        </div>

        {/* Role */}
        <div className="animus-detail__field">
          <div className="animus-detail__field-label">Role</div>
          <div className="animus-detail__field-value">{animus.primaryRole}</div>
        </div>

        {/* Lattice */}
        <div className="animus-detail__field">
          <div className="animus-detail__field-label">Lattice Priority</div>
          <div className="animus-detail__field-value">{animus.latticePriority}</div>
        </div>

        {/* Shadow print */}
        {animus.isShadowPrintRequired && (
          <div className="animus-detail__sp-banner">
            <span style={{ color: '#f5c842', fontWeight: 800 }}>★</span> Shadow Print required for 6★ ascension
          </div>
        )}

        {/* Affinity combat */}
        <div className="animus-detail__affinity-section">
          <div className="animus-detail__field-label" style={{ marginBottom: 10 }}>Affinity Combat</div>

          {beats && (
            <div className="animus-detail__affinity-row animus-detail__affinity-row--advantage">
              <div className="animus-detail__affinity-row-header">
                <span className="animus-detail__affinity-row-badge animus-detail__affinity-row-badge--adv">ADV</span>
                Strong vs <AffinityBadge affinity={beats} showIcon={false} />
              </div>
              <div className="animus-detail__affinity-modifiers">
                <span>+{(AFFINITY_ADVANTAGE.critRateBonus * 100).toFixed(0)}% Crit Rate</span>
                <span>+{(AFFINITY_ADVANTAGE.damageBonus  * 100).toFixed(0)}% Damage</span>
              </div>
            </div>
          )}

          {weakTo && (
            <div className="animus-detail__affinity-row animus-detail__affinity-row--disadvantage">
              <div className="animus-detail__affinity-row-header">
                <span className="animus-detail__affinity-row-badge animus-detail__affinity-row-badge--dis">DIS</span>
                Weak to <AffinityBadge affinity={weakTo as typeof animus.affinity} showIcon={false} />
              </div>
              <div className="animus-detail__affinity-modifiers">
                <span>{(AFFINITY_DISADVANTAGE.critRatePenalty  * 100).toFixed(0)}% Crit Rate</span>
                <span>{(AFFINITY_DISADVANTAGE.damagePenalty    * 100).toFixed(0)}% Damage</span>
                <span>{(AFFINITY_DISADVANTAGE.effectAccPenalty * 100).toFixed(0)}% Eff Acc</span>
              </div>
              <div className="animus-detail__inferno-warning">
                ⚠ Inferno: +200% damage taken
              </div>
            </div>
          )}

          {/* Neutral (Constant ↔ Disorder pair) */}
          {!beats && !weakTo && (
            <div style={{ fontSize: 12, color: 'var(--tx-3)' }}>
              Neutral to the elemental cycle.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
