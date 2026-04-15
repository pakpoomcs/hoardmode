import type { Affinity } from '@/types';

// ─── Affinity Cycle ───────────────────────────────────────────────────────────
// Reason > Hollow > Odd > Reason (cyclical)
// Constant ↔ Disorder (opposed, neutral to cycle)

export const AFFINITY_CYCLE: Record<Affinity, Affinity | null> = {
  Reason:   'Hollow',   // Reason beats Hollow
  Hollow:   'Odd',      // Hollow beats Odd
  Odd:      'Reason',   // Odd beats Reason
  Constant: 'Disorder', // Constant beats Disorder
  Disorder: 'Constant', // Disorder beats Constant
};

/** Returns the affinity that has advantage against the given affinity. */
export function getCounterAffinity(affinity: Affinity): Affinity {
  const entries = Object.entries(AFFINITY_CYCLE) as [Affinity, Affinity | null][];
  const counter = entries.find(([, beats]) => beats === affinity);
  return counter ? counter[0] : affinity;
}

/** Returns true if attacker has elemental advantage over defender. */
export function hasAdvantage(attacker: Affinity, defender: Affinity): boolean {
  return AFFINITY_CYCLE[attacker] === defender;
}

/** Returns true if attacker has elemental disadvantage against defender. */
export function hasDisadvantage(attacker: Affinity, defender: Affinity): boolean {
  return AFFINITY_CYCLE[defender] === attacker;
}

// ─── Combat Impact Values ─────────────────────────────────────────────────────

export const AFFINITY_ADVANTAGE = {
  critRateBonus:   0.15,   // +15% Crit Rate
  damageBonus:     0.15,   // +15% Damage
} as const;

export const AFFINITY_DISADVANTAGE = {
  critRatePenalty:    -0.30,  // -30% Crit Rate
  damagePenalty:      -0.15,  // -15% Damage
  effectAccPenalty:   -0.50,  // -50% Effect Accuracy
  infernoBonusDamage:  2.00,  // +200% additional damage taken (Inferno only)
} as const;

// ─── Speed Breakpoints ────────────────────────────────────────────────────────

export const SPEED_BREAKPOINTS = [
  { threshold: 185, label: 'T1 Opener',          cssClass: 'spd-t1', description: 'Guaranteed first action in standard content' },
  { threshold: 170, label: 'Competitive',         cssClass: 'spd-t2', description: 'Competitive PvP / Hyperlink priority' },
  { threshold: 155, label: 'Standard Support',    cssClass: 'spd-t3', description: 'Reliable support action before most DPS' },
  { threshold: 140, label: 'Bruiser Minimum',     cssClass: 'spd-t4', description: 'Minimum for effective tank / bruiser play' },
] as const;

export type SpeedTier = typeof SPEED_BREAKPOINTS[number];

export function getSpeedTier(speed: number): SpeedTier {
  return (
    SPEED_BREAKPOINTS.find((bp) => speed >= bp.threshold) ??
    SPEED_BREAKPOINTS[SPEED_BREAKPOINTS.length - 1]
  );
}

/** Returns how many substat rolls (each +3 SPD) are needed to hit the next tier. */
export function rollsToNextTier(currentSpeed: number): { target: number; rolls: number; tierLabel: string } | null {
  const next = SPEED_BREAKPOINTS.find((bp) => bp.threshold > currentSpeed);
  if (!next) return null;
  const gap = next.threshold - currentSpeed;
  return {
    target: next.threshold,
    rolls: Math.ceil(gap / 3),
    tierLabel: next.label,
  };
}

// ─── Daily Farm Schedule ──────────────────────────────────────────────────────
// 0 = Sunday … 6 = Saturday

export const FARM_SCHEDULE: Record<number, { modules: string[]; label: string }> = {
  1: { modules: ['revelation', 'crit'],       label: 'ATK / Crit Modules' },
  2: { modules: ['wellspring', 'bulwark'],    label: 'HP / DEF Modules' },
  3: { modules: ['swift-rush'],               label: 'Speed Modules — Highest Priority' },
  4: { modules: ['revelation', 'crit'],       label: 'ATK / Crit Modules' },
  5: { modules: ['wellspring', 'bulwark'],    label: 'HP / DEF Modules' },
  6: { modules: ['swift-rush'],               label: 'Speed Modules — Highest Priority' },
  0: { modules: ['harvest'],                  label: 'Rotation Flex' },
};
