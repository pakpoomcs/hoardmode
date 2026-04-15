// ─── Affinities ───────────────────────────────────────────────────────────────

export type Affinity = 'Reason' | 'Hollow' | 'Odd' | 'Disorder' | 'Constant';

export type Tier = 'SSS' | 'SS' | 'S' | 'A';

// ─── Animus ───────────────────────────────────────────────────────────────────

export interface Animus {
  id: string;
  name: string;
  tier: Tier;
  affinity: Affinity;
  baseSpeed: number;
  primaryRole: string;
  latticePriority: string;
  isShadowPrintRequired: boolean;
  imageFile: string;
}

// ─── Boss ─────────────────────────────────────────────────────────────────────

export type RequiredUtility = 'CC' | 'Dispel' | 'Burst';

export interface Boss {
  id: string;
  name: string;
  affinity: Affinity;
  difficultyTiers: string[];
  mechanics: string[];
  immuneToDoT: boolean;
  requiredUtility: RequiredUtility;
  recommendedCounters: string[];
  advantageAffinity: Affinity;
  notes: string;
}

// ─── Modules ──────────────────────────────────────────────────────────────────

export interface Module {
  id: string;
  name: string;
  primaryStats: string[];
  idealRole: string;
  pvpDetail: string;
}

// ─── User Presets ─────────────────────────────────────────────────────────────

export interface RosterEntry {
  animusId: string;
  stars: number;
  speed: number;
  modules: string[];
  notes: string;
}

export interface Preset {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  roster: RosterEntry[];
}

export interface UserData {
  userId: string;
  presets: Preset[];
}
