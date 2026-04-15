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
  const beats  = AFFINITY_CYCLE[animus.affinity];
  const weakTo = (Object.entries(AFFINITY_CYCLE)
    .find(([, v]) => v === animus.affinity)?.[0] ?? null) as typeof animus.affinity | null;

  return (
    <div className="animus-detail">
      <button className="animus-detail__close" onClick={onClose} aria-label="Close">✕</button>

      <div className="animus-detail__inner">
        {/* Left — portrait */}
        <div className="animus-detail__portrait-wrap">
          <img
            src={`/assets/animus/${animus.imageFile}`}
            alt={animus.name}
            className="animus-detail__portrait"
          />
          <div className="animus-detail__portrait-gradient" />
          <div className="animus-detail__portrait-badges">
            <span className={`tier-badge tier-badge--${animus.tier}`}>{animus.tier}</span>
            {animus.isShadowPrintRequired && (
              <span style={{ fontSize: 10, fontWeight: 800, color: '#f5c842' }}>★ SP</span>
            )}
          </div>
        </div>

        {/* Right — info */}
        <div className="animus-detail__info">
          {/* Name + affinity */}
          <div className="animus-detail__header">
            <div className="animus-detail__name">{animus.name}</div>
            <AffinityBadge affinity={animus.affinity} />
          </div>

          {/* Stats row */}
          <div className="animus-detail__stats">
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
            <div className="animus-detail__stat">
              <div className="animus-detail__stat-label">Role</div>
              <div className="animus-detail__stat-value">{animus.primaryRole}</div>
            </div>
            <div className="animus-detail__stat">
              <div className="animus-detail__stat-label">Lattice Priority</div>
              <div className="animus-detail__stat-value">{animus.latticePriority}</div>
            </div>
          </div>

          {/* Affinity combat */}
          <div className="animus-detail__combat">
            {beats && (
              <div className="animus-detail__affinity-row animus-detail__affinity-row--advantage">
                <span className="animus-detail__affinity-row-badge animus-detail__affinity-row-badge--adv">ADV</span>
                <span style={{ fontSize: 12, color: 'var(--tx-2)' }}>Strong vs</span>
                <AffinityBadge affinity={beats} showIcon={false} />
                <div className="animus-detail__affinity-modifiers">
                  <span>+{(AFFINITY_ADVANTAGE.critRateBonus * 100).toFixed(0)}% Crit</span>
                  <span>+{(AFFINITY_ADVANTAGE.damageBonus   * 100).toFixed(0)}% DMG</span>
                </div>
              </div>
            )}
            {weakTo && (
              <div className="animus-detail__affinity-row animus-detail__affinity-row--disadvantage">
                <span className="animus-detail__affinity-row-badge animus-detail__affinity-row-badge--dis">DIS</span>
                <span style={{ fontSize: 12, color: 'var(--tx-2)' }}>Weak to</span>
                <AffinityBadge affinity={weakTo} showIcon={false} />
                <div className="animus-detail__affinity-modifiers">
                  <span>{(AFFINITY_DISADVANTAGE.critRatePenalty  * 100).toFixed(0)}% Crit</span>
                  <span>{(AFFINITY_DISADVANTAGE.damagePenalty    * 100).toFixed(0)}% DMG</span>
                  <span>{(AFFINITY_DISADVANTAGE.effectAccPenalty * 100).toFixed(0)}% Eff Acc</span>
                </div>
                <span className="animus-detail__inferno-warning">⚠ Inferno +200%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
