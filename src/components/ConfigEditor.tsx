// ============================================================
// xml-gcamcon — ConfigEditor Component
// Main config editor — orchestrates lens tabs, categories, params
// ============================================================

"use client";

import { useState, useCallback } from "react";
import type { UserConfig, GcamPortId, ParamValue, CameraId } from "@/types";
import { getPortSchema } from "@/lib/schemas";
import { getDevice, getSensorName } from "@/lib/devices";
import { updateConfigParam } from "@/lib/generator";
import LensTabs from "./LensTabs";
import CategoryPanel from "./CategoryPanel";

interface ConfigEditorProps {
  config: UserConfig;
  onConfigChange: (config: UserConfig) => void;
}

export default function ConfigEditor({ config, onConfigChange }: ConfigEditorProps) {
  const schema = getPortSchema(config.portId);
  const device = getDevice(config.deviceCodename);
  const [activeLens, setActiveLens] = useState<CameraId | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleParamChange = useCallback(
    (key: string, value: number | boolean | string) => {
      const updated = updateConfigParam(config, key, value, activeLens ?? undefined);
      onConfigChange(updated);
    },
    [config, activeLens, onConfigChange]
  );

  // Get params for current view (global or per-lens)
  const currentParams = activeLens !== null
    ? (config.lensConfigs.find((lc) => lc.cameraId === activeLens)?.params || [])
    : config.globalParams;

  // Filter categories: if lens selected, show all perLens=true categories PLUS global-only ones
  const visibleCategories = schema.categories.filter((cat) => {
    if (activeLens === null) {
      // Global view: show non-per-lens categories
      return !cat.perLens;
    }
    // Lens view: show per-lens categories
    return cat.perLens;
  });

  const activeLensLabel = activeLens !== null && device
    ? getSensorName(device, activeLens)
    : "Global Settings";

  const hasPerLensCategories = schema.categories.some((c) => c.perLens);

  return (
    <div className="space-y-4">
      {/* Lens Tabs */}
      {hasPerLensCategories && (
        <div className="card p-4">
          <LensTabs
            lensIds={schema.supportedLenses}
            activeLens={activeLens}
            onSelectLens={setActiveLens}
            device={device || getDevice("custom")!}
            showGlobal={true}
            onSelectGlobal={() => setActiveLens(null)}
          />
          <p className="text-xs text-[var(--text-muted)] mt-2">
            Editing: <span className="text-[var(--accent)] font-medium">{activeLensLabel}</span>
          </p>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search parameters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] rounded-xl pl-10 pr-4 py-2.5 text-sm focus-ring focus:border-[var(--accent)] transition-colors"
        />
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {visibleCategories.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-[var(--text-muted)]">No settings available for this view. Select a lens to configure per-lens settings.</p>
          </div>
        ) : (
          visibleCategories
            .filter((cat) => {
              if (!searchTerm) return true;
              const term = searchTerm.toLowerCase();
              return (
                cat.label.toLowerCase().includes(term) ||
                cat.params.some((p) => p.label.toLowerCase().includes(term) || p.key.toLowerCase().includes(term))
              );
            })
            .map((category) => (
              <CategoryPanel
                key={category.id}
                category={category}
                params={currentParams}
                onParamChange={handleParamChange}
                cameraId={activeLens ?? undefined}
                defaultExpanded={category.id === "libpatcher"}
              />
            ))
        )}
      </div>
    </div>
  );
}
