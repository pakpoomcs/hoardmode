import { useCallback, useEffect, useState } from 'react';
import type { Preset, UserData } from '@/types';

const LS_KEY = 'hoardmode_user';
const API_BASE = '/api/presets';

// ─── UUID helper (no external dep needed) ─────────────────────────────────────

function generateUserId(): string {
  return crypto.randomUUID();
}

// ─── localStorage layer ───────────────────────────────────────────────────────

function loadLocal(): UserData {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as UserData;
  } catch {
    /* ignore corrupt data */
  }
  const fresh: UserData = { userId: generateUserId(), presets: [] };
  saveLocal(fresh);
  return fresh;
}

function saveLocal(data: UserData): void {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// ─── KV sync layer ────────────────────────────────────────────────────────────

async function pushToKV(userId: string, presets: Preset[]): Promise<void> {
  await fetch(`${API_BASE}/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(presets),
  });
}

async function pullFromKV(userId: string): Promise<Preset[] | null> {
  try {
    const res = await fetch(`${API_BASE}/${userId}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { presets: Preset[] };
    return data.presets;
  } catch {
    return null;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePresets() {
  const [userData, setUserData] = useState<UserData>(() => loadLocal());
  const [syncing, setSyncing] = useState(false);

  // On mount, pull from KV and merge (KV wins for cross-device sync)
  useEffect(() => {
    let cancelled = false;
    setSyncing(true);
    pullFromKV(userData.userId).then((remote) => {
      if (cancelled || !remote) return;
      setUserData((prev) => {
        const merged = { ...prev, presets: remote };
        saveLocal(merged);
        return merged;
      });
    }).finally(() => {
      if (!cancelled) setSyncing(false);
    });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.userId]);

  const savePreset = useCallback((preset: Preset) => {
    setUserData((prev) => {
      const exists = prev.presets.findIndex((p) => p.id === preset.id);
      const updated = exists >= 0
        ? prev.presets.map((p) => (p.id === preset.id ? preset : p))
        : [...prev.presets, preset];
      const next = { ...prev, presets: updated };
      saveLocal(next);
      pushToKV(prev.userId, updated);
      return next;
    });
  }, []);

  const deletePreset = useCallback((presetId: string) => {
    setUserData((prev) => {
      const updated = prev.presets.filter((p) => p.id !== presetId);
      const next = { ...prev, presets: updated };
      saveLocal(next);
      pushToKV(prev.userId, updated);
      return next;
    });
  }, []);

  const exportPresets = useCallback((): string => {
    return JSON.stringify(userData.presets, null, 2);
  }, [userData.presets]);

  const importPresets = useCallback((json: string) => {
    try {
      const imported = JSON.parse(json) as Preset[];
      setUserData((prev) => {
        const next = { ...prev, presets: imported };
        saveLocal(next);
        pushToKV(prev.userId, imported);
        return next;
      });
    } catch {
      throw new Error('Invalid preset file.');
    }
  }, []);

  return {
    userId: userData.userId,
    presets: userData.presets,
    syncing,
    savePreset,
    deletePreset,
    exportPresets,
    importPresets,
  };
}
