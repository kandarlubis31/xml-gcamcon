// ============================================================
// xml-gcamcon — Config Diff Utility
// Compute differences between two UserConfig objects
// ============================================================

import type { UserConfig, ParamValue, LensConfig } from "@/types";

export interface ParamDiff {
  key: string;
  label: string;
  category: string;
  cameraId: number | null;
  leftValue: number | boolean | string;
  rightValue: number | boolean | string;
  changed: boolean;
}

export interface DiffResult {
  diffs: ParamDiff[];
  summary: {
    total: number;
    changed: number;
    added: number;
    removed: number;
  };
}

/**
 * Compute side-by-side diff between two configs.
 * Designed for same portId — comparing different ports yields unpredictable results.
 */
export function computeDiff(left: UserConfig, right: UserConfig): DiffResult {
  const diffs: ParamDiff[] = [];

  // Collect all unique keys from both configs
  const leftMap = buildParamMap(left);
  const rightMap = buildParamMap(right);
  const allKeys = new Set([...leftMap.keys(), ...rightMap.keys()]);

  for (const key of allKeys) {
    const lp = leftMap.get(key);
    const rp = rightMap.get(key);

    diffs.push({
      key,
      label: key,
      category: "unknown",
      cameraId: lp?.cameraId ?? rp?.cameraId ?? null,
      leftValue: lp?.value ?? "(not set)",
      rightValue: rp?.value ?? "(not set)",
      changed: JSON.stringify(lp?.value) !== JSON.stringify(rp?.value),
    });
  }

  const changed = diffs.filter((d) => d.changed).length;
  const added = diffs.filter((d) => !leftMap.has(d.key)).length;
  const removed = diffs.filter((d) => !rightMap.has(d.key)).length;

  return {
    diffs: diffs.sort((a, b) => a.key.localeCompare(b.key)),
    summary: { total: diffs.length, changed, added, removed },
  };
}

interface ParamEntry {
  key: string;
  value: number | boolean | string;
  cameraId: number | null;
}

function buildParamMap(config: UserConfig): Map<string, ParamEntry> {
  const map = new Map<string, ParamEntry>();

  for (const p of config.globalParams) {
    map.set(p.key, { key: p.key, value: p.value, cameraId: null });
  }

  for (const lc of config.lensConfigs) {
    for (const p of lc.params) {
      map.set(`${lc.cameraId}:${p.key}`, { key: p.key, value: p.value, cameraId: lc.cameraId });
    }
  }

  return map;
}
