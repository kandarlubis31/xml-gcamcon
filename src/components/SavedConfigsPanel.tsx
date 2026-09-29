// ============================================================
// xml-gcamcon — SavedConfigsPanel Component
// Lists all saved configs with load/delete/compare actions
// ============================================================

"use client";

import type { UserConfig } from "@/types";
import { useState } from "react";

interface SavedConfigsPanelProps {
  configs: UserConfig[];
  activeConfigId: string;
  onLoad: (config: UserConfig) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (config: UserConfig) => void;
  onCompare?: (a: UserConfig, b: UserConfig) => void;
}

export default function SavedConfigsPanel({
  configs,
  activeConfigId,
  onLoad,
  onDelete,
  onDuplicate,
  onCompare,
}: SavedConfigsPanelProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [compareSelection, setCompareSelection] = useState<string | null>(null);

  if (configs.length === 0) {
    return (
      <div className="card p-8 text-center space-y-3">
        <span className="text-4xl">📭</span>
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">No saved configs yet</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Create or import a config and hit <span className="text-[var(--accent)] font-semibold">💾 Save</span> to store it here!
          </p>
        </div>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      // Auto-clear confirmation after 3s
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleCompareClick = (id: string) => {
    if (compareSelection === null) {
      setCompareSelection(id);
    } else if (compareSelection === id) {
      setCompareSelection(null);
    } else {
      const a = configs.find((c) => c.id === compareSelection);
      const b = configs.find((c) => c.id === id);
      if (a && b && onCompare) {
        onCompare(a, b);
        setCompareSelection(null);
      }
    }
  };

  return (
    <div className="space-y-2">
      {configs.map((c) => {
        const isActive = c.id === activeConfigId;
        const isComparing = c.id === compareSelection;

        return (
          <div
            key={c.id}
            className={`card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
              isActive
                ? "border-[var(--accent)] shadow-[0_0_12px_var(--accent-glow)]"
                : isComparing
                  ? "border-[var(--warning)] shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                  : ""
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{c.name}</p>
                {isActive && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-[var(--accent)]/20 text-[var(--accent)] rounded-full font-medium shrink-0">
                    Active
                  </span>
                )}
                {isComparing && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-[var(--warning)]/20 text-[var(--warning)] rounded-full font-medium shrink-0">
                    Selected for compare
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {c.portId.toUpperCase()} · {c.deviceCodename} · {new Date(c.updatedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-1.5 shrink-0">
              {onCompare && (
                <button
                  onClick={() => handleCompareClick(c.id)}
                  className={`px-2.5 py-1.5 text-[10px] font-semibold rounded-lg border transition-all ${
                    isComparing
                      ? "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/40"
                      : "bg-[var(--bg-tertiary)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text-secondary)]"
                  }`}
                  title="Compare configs"
                >
                  {isComparing ? "✓ Selected" : "⇆ Compare"}
                </button>
              )}
              {onDuplicate && (
                <button
                  onClick={() => onDuplicate(c)}
                  className="px-2.5 py-1.5 text-[10px] font-semibold bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] rounded-lg border border-[var(--border)] transition-all"
                  title="Duplicate config"
                >
                  📋 Dup
                </button>
              )}
              <button
                onClick={() => onLoad(c)}
                className="px-3 py-1.5 text-xs font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-lg transition-all"
              >
                Load
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  deleteConfirm === c.id
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
                }`}
              >
                {deleteConfirm === c.id ? "Sure?" : "Delete"}
              </button>
            </div>
          </div>
        );
      })}

      {/* Compare hint */}
      {compareSelection && (
        <p className="text-xs text-[var(--text-muted)] text-center mt-2">
          Select a second config to compare with. Click again to cancel.
        </p>
      )}
    </div>
  );
}
