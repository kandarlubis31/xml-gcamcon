// ============================================================
// xml-gcamcon — PresetSelector Component
// Select and apply preset config templates
// ============================================================

"use client";

import { useState } from "react";
import type { GcamPortId, PresetTemplate, UserConfig } from "@/types";
import { allPresets } from "@/lib/presets";
import { createDefaultConfig } from "@/lib/generator";

interface PresetSelectorProps {
  portId: GcamPortId;
  deviceCodename: string;
  onPresetApplied: (config: UserConfig) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function PresetSelector({
  portId,
  deviceCodename,
  onPresetApplied,
  isOpen,
  onClose,
}: PresetSelectorProps) {
  const [filter, setFilter] = useState<string>("all");

  // Filter presets by current device
  const devicePresets = allPresets.filter((p) => p.deviceCodename === deviceCodename);
  const filteredPresets = filter === "all"
    ? devicePresets
    : devicePresets.filter((p) => p.portId === filter || p.tags.includes(filter));

  const tags = Array.from(new Set(devicePresets.flatMap((p) => [...p.tags])));

  const handleSelectPreset = (preset: PresetTemplate) => {
    onPresetApplied(JSON.parse(JSON.stringify(preset.config)));
    onClose();
  };

  const handleBlankConfig = () => {
    const config = createDefaultConfig(portId, deviceCodename, "New Config");
    onPresetApplied(config);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="card w-full max-w-2xl mx-4 p-6 space-y-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Choose a Template</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-xs rounded-full transition-all ${filter === "all" ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]"}`}
          >
            All
          </button>
          {["bsg", "lmc"].map((port) => (
            <button
              key={port}
              onClick={() => setFilter(port)}
              className={`px-3 py-1 text-xs rounded-full uppercase transition-all ${filter === port ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]"}`}
            >
              {port}
            </button>
          ))}
          {tags.filter((t) => t !== "bsg" && t !== "lmc").slice(0, 6).map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-3 py-1 text-xs rounded-full transition-all ${filter === tag ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]"}`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Blank config */}
        <button
          onClick={handleBlankConfig}
          className="w-full text-left card p-4 border-dashed border-2 border-[var(--border)] hover:border-[var(--accent)] transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                Blank / Default Config
              </p>
              <p className="text-xs text-[var(--text-muted)]">Start fresh with default values</p>
            </div>
          </div>
        </button>

        {/* Preset cards */}
        <div className="grid gap-3">
          {allPresets.filter((p) => p.deviceCodename !== deviceCodename).length > 0 && (
            <p className="text-xs text-[var(--text-muted)] text-center">
              💡 {allPresets.filter((p) => p.deviceCodename !== deviceCodename).length} more presets available for other devices
            </p>
          )}

          {filteredPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="text-left card p-4 hover:border-[var(--accent)] transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    {preset.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{preset.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="px-2 py-0.5 text-[10px] bg-[var(--accent)]/20 text-[var(--accent)] rounded-full uppercase font-medium">
                      {preset.portId}
                    </span>
                    {preset.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-[10px] bg-[var(--bg-tertiary)] text-[var(--text-muted)] rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {preset.author && (
                  <span className="text-[10px] text-[var(--text-muted)] shrink-0">by {preset.author}</span>
                )}
              </div>
            </button>
          ))}

          {/* Empty state */}
          {filteredPresets.length === 0 && (
            <div className="text-center py-8 space-y-2">
              <span className="text-3xl">📭</span>
              <p className="text-sm text-[var(--text-muted)]">No presets for this device yet.</p>
              <p className="text-xs text-[var(--text-muted)]">Try switching to Mi A1, RN10 Pro, or POCO X3 NFC.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
