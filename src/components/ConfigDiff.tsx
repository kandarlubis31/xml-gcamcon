// ============================================================
// xml-gcamcon — ConfigDiff Component
// Side-by-side comparison view for two configs
// ============================================================

"use client";

import { useMemo } from "react";
import type { UserConfig } from "@/types";
import { computeDiff } from "@/lib/diff";

interface ConfigDiffProps {
  left: UserConfig;
  right: UserConfig;
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfigDiff({ left, right, isOpen, onClose }: ConfigDiffProps) {
  const result = useMemo(() => computeDiff(left, right), [left, right]);
  const { diffs, summary } = result;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="card w-full max-w-4xl mx-4 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Config Diff</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Summary */}
        <div className="flex flex-wrap gap-3">
          <SummaryBadge label="Total Params" value={summary.total} color="muted" />
          <SummaryBadge label="Changed" value={summary.changed} color="warning" />
          <SummaryBadge label="Added" value={summary.added} color="success" />
          <SummaryBadge label="Removed" value={summary.removed} color="danger" />
        </div>

        {/* Config names */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--bg-tertiary)] rounded-lg px-3 py-2">
            <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Left</p>
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">{left.name}</p>
          </div>
          <div className="bg-[var(--bg-tertiary)] rounded-lg px-3 py-2">
            <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Right</p>
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">{right.name}</p>
          </div>
        </div>

        {/* Diff table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-2 px-3 text-[var(--text-muted)] font-semibold">Param</th>
                <th className="text-left py-2 px-3 text-[var(--text-muted)] font-semibold">Lens</th>
                <th className="text-left py-2 px-3 text-[var(--text-muted)] font-semibold">{left.name}</th>
                <th className="text-left py-2 px-3 text-[var(--text-muted)] font-semibold">{right.name}</th>
              </tr>
            </thead>
            <tbody>
              {diffs.map((d) => (
                <tr
                  key={d.key}
                  className={`border-b border-[var(--border)]/50 transition-colors ${
                    d.changed ? "bg-[var(--warning)]/5" : ""
                  }`}
                >
                  <td className="py-2 px-3 font-mono text-[var(--text-secondary)]">{d.key}</td>
                  <td className="py-2 px-3 text-[var(--text-muted)]">
                    {d.cameraId !== null ? `Cam ${d.cameraId}` : "Global"}
                  </td>
                  <td className={`py-2 px-3 font-mono ${d.changed ? "text-red-400" : "text-[var(--text-primary)]"}`}>
                    {String(d.leftValue)}
                  </td>
                  <td className={`py-2 px-3 font-mono ${d.changed ? "text-[var(--success)]" : "text-[var(--text-primary)]"}`}>
                    {String(d.rightValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {diffs.length === 0 && (
          <p className="text-sm text-[var(--text-muted)] text-center py-8">
            No differences found — configs are identical!
          </p>
        )}
      </div>
    </div>
  );
}

function SummaryBadge({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    warning: "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/30",
    success: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/30",
    danger: "bg-red-500/10 text-red-400 border-red-500/30",
    muted: "bg-[var(--bg-tertiary)] text-[var(--text-muted)] border-[var(--border)]",
  };

  return (
    <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${colorMap[color] || colorMap.muted}`}>
      {label}: {value}
    </div>
  );
}
