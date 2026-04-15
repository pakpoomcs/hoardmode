import { useRef, useState } from 'react';
import type { Animus } from '@/types';
import {
  AFFINITY_CYCLE,
  AFFINITY_ADVANTAGE,
  AFFINITY_DISADVANTAGE,
  getSpeedTier,
  rollsToNextTier,
} from '@/data/constants';

interface Props {
  animus: Animus;
  onClose: () => void;
}

// ─── Affinity theming ─────────────────────────────────────────────────────────

const AFF_THEME: Record<string, { primary: string; secondary: string; glow: string; bg: string }> = {
  Reason:   { primary: '#e05252', secondary: '#ff9090', glow: 'rgba(224,82,82,0.55)',   bg: 'rgba(224,82,82,0.08)'   },
  Hollow:   { primary: '#4cca6f', secondary: '#90ffb0', glow: 'rgba(76,202,111,0.55)',  bg: 'rgba(76,202,111,0.08)'  },
  Odd:      { primary: '#5b9cf6', secondary: '#a0c8ff', glow: 'rgba(91,156,246,0.55)',  bg: 'rgba(91,156,246,0.08)'  },
  Constant: { primary: '#b0b0cc', secondary: '#e0e0f5', glow: 'rgba(176,176,204,0.45)', bg: 'rgba(176,176,204,0.06)' },
  Disorder: { primary: '#b06ef0', secondary: '#d8a0ff', glow: 'rgba(176,110,240,0.55)', bg: 'rgba(176,110,240,0.08)' },
};

const TIER_STARS: Record<string, number> = { SSS: 5, SS: 4, S: 3, A: 2 };

// ─── Component ────────────────────────────────────────────────────────────────

export function AnimusDetail({ animus, onClose }: Props) {
  const theme   = AFF_THEME[animus.affinity];
  const beats   = AFFINITY_CYCLE[animus.affinity];
  const weakTo  = (Object.entries(AFFINITY_CYCLE).find(([, v]) => v === animus.affinity)?.[0] ?? null) as typeof animus.affinity | null;
  const spdTier = getSpeedTier(animus.baseSpeed);
  const nextTier = rollsToNextTier(animus.baseSpeed);
  const stars   = TIER_STARS[animus.tier] ?? 2;

  // Max speed for the progress bar reference
  const SPD_MAX = 185;
  const spdPct  = Math.min((animus.baseSpeed / SPD_MAX) * 100, 100);

  // ── 3-D tilt + holographic shine on mouse move ────────────────────────────
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt,  setTilt]  = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);

  function onMouseMove(e: React.MouseEvent) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top)  / r.height;
    setTilt({ x: (ny - 0.5) * -18, y: (nx - 0.5) * 18 });
    setShine({ x: nx * 100, y: ny * 100 });
  }

  function onMouseLeave() {
    setTilt({ x: 0, y: 0 });
    setShine({ x: 50, y: 50 });
    setHovering(false);
  }

  return (
    <div className="card-stage" style={{ '--aff-glow': theme.glow, '--aff-bg': theme.bg } as React.CSSProperties}>

      {/* Close sits outside the card */}
      <button className="card-stage__close" onClick={onClose}>✕</button>

      {/* ── The Trading Card ───────────────────────────────────────────── */}
      <div
        ref={cardRef}
        className="trading-card"
        style={{
          '--aff-primary':   theme.primary,
          '--aff-secondary': theme.secondary,
          '--aff-glow':      theme.glow,
          '--shine-x':       `${shine.x}%`,
          '--shine-y':       `${shine.y}%`,
          transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovering ? 1.02 : 1})`,
          transition: hovering ? 'transform 0.05s linear' : 'transform 0.5s cubic-bezier(.2,.8,.3,1)',
        } as React.CSSProperties}
        onMouseMove={(e) => { setHovering(true); onMouseMove(e); }}
        onMouseLeave={onMouseLeave}
      >
        {/* Holographic shine overlay */}
        <div className="trading-card__shine" />

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="trading-card__header">
          <span className="trading-card__card-name">{animus.name}</span>
          <div className="trading-card__header-right">
            <img
              src={`/assets/affinities/${animus.affinity.toUpperCase()}.webp`}
              alt={animus.affinity}
              className="trading-card__aff-icon"
            />
          </div>
        </div>

        {/* ── Portrait ───────────────────────────────────────────────── */}
        <div className="trading-card__art-frame">
          <img
            src={`/assets/animus/${animus.imageFile}`}
            alt={animus.name}
            className="trading-card__art"
          />
          {/* Iridescent frame corners */}
          <div className="trading-card__art-corner trading-card__art-corner--tl" />
          <div className="trading-card__art-corner trading-card__art-corner--tr" />
          <div className="trading-card__art-corner trading-card__art-corner--bl" />
          <div className="trading-card__art-corner trading-card__art-corner--br" />
        </div>

        {/* ── Tier / Stars bar ───────────────────────────────────────── */}
        <div className="trading-card__tier-bar">
          <div className="trading-card__stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`trading-card__star ${i < stars ? 'trading-card__star--on' : ''}`}>★</span>
            ))}
          </div>
          <span className={`tier-badge tier-badge--${animus.tier}`}>{animus.tier}</span>
          <span className="trading-card__role-tag">{animus.primaryRole}</span>
        </div>

        {/* ── Divider ────────────────────────────────────────────────── */}
        <div className="trading-card__divider" />

        {/* ── Stats body ─────────────────────────────────────────────── */}
        <div className="trading-card__body">

          {/* Speed row */}
          <div className="trading-card__stat-row">
            <span className="trading-card__stat-label">SPD</span>
            <div className="trading-card__spd-bar-wrap">
              <div className="trading-card__spd-bar">
                <div
                  className="trading-card__spd-fill"
                  style={{ width: `${spdPct}%` }}
                />
              </div>
            </div>
            <span className={`trading-card__spd-value ${spdTier.cssClass}`}>{animus.baseSpeed}</span>
            {nextTier && (
              <span className="trading-card__spd-gap">+{nextTier.rolls} → {nextTier.target}</span>
            )}
          </div>

          {/* Lattice */}
          <div className="trading-card__stat-row">
            <span className="trading-card__stat-label">LAT</span>
            <span className="trading-card__lattice-text">{animus.latticePriority}</span>
          </div>

        </div>

        {/* ── Divider ────────────────────────────────────────────────── */}
        <div className="trading-card__divider" />

        {/* ── Affinity combat ────────────────────────────────────────── */}
        <div className="trading-card__combat">
          {beats && (
            <div className="trading-card__combat-row trading-card__combat-row--adv">
              <span className="trading-card__combat-badge trading-card__combat-badge--adv">ADV</span>
              <span className="trading-card__combat-vs">vs {beats}</span>
              <span className="trading-card__combat-mod">+{(AFFINITY_ADVANTAGE.critRateBonus * 100).toFixed(0)}% Crit</span>
              <span className="trading-card__combat-mod">+{(AFFINITY_ADVANTAGE.damageBonus   * 100).toFixed(0)}% DMG</span>
            </div>
          )}
          {weakTo && (
            <div className="trading-card__combat-row trading-card__combat-row--dis">
              <span className="trading-card__combat-badge trading-card__combat-badge--dis">DIS</span>
              <span className="trading-card__combat-vs">vs {weakTo}</span>
              <span className="trading-card__combat-mod">{(AFFINITY_DISADVANTAGE.critRatePenalty * 100).toFixed(0)}% Crit</span>
              <span className="trading-card__combat-mod">{(AFFINITY_DISADVANTAGE.damagePenalty   * 100).toFixed(0)}% DMG</span>
              <span className="trading-card__combat-mod trading-card__combat-mod--inferno">⚠ Inferno</span>
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div className="trading-card__footer">
          {animus.isShadowPrintRequired
            ? <span className="trading-card__sp">★ Shadow Print Required</span>
            : <span />
          }
          <span className="trading-card__affinity-text">{animus.affinity}</span>
        </div>

      </div>
    </div>
  );
}
