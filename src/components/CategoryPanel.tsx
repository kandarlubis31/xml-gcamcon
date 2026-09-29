// ============================================================
// xml-gcamcon — CategoryPanel Component
// Expandable category section with parameter controls
// ============================================================

"use client";

import { useState } from "react";
import type { ParamCategory, ParamDefinition, ParamValue, CameraId } from "@/types";
import ParamControl from "./ParamControl";

interface CategoryPanelProps {
  category: ParamCategory;
  params: ParamValue[];
  onParamChange: (key: string, value: number | boolean | string) => void;
  cameraId?: CameraId;
  defaultExpanded?: boolean;
}

export default function CategoryPanel({
  category,
  params,
  onParamChange,
  cameraId,
  defaultExpanded = false,
}: CategoryPanelProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const basicParams = category.params.filter((p) => !p.advanced);
  const advancedParams = category.params.filter((p) => p.advanced);

  function getValue(def: ParamDefinition): number | boolean | string {
    const found = params.find((p) => p.key === def.key);
    return found !== undefined ? found.value : def.defaultValue;
  }

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[var(--bg-tertiary)]/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{category.icon}</span>
          <span className="text-sm font-semibold text-[var(--text-primary)]">{category.label}</span>
          <span className="text-[10px] bg-[var(--bg-tertiary)] text-[var(--text-muted)] px-2 py-0.5 rounded-full">
            {category.params.length}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-[var(--text-muted)] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-5 pb-4 space-y-4 border-t border-[var(--border)] pt-4">
          {basicParams.length === 0 && advancedParams.length === 0 && (
            <p className="text-sm text-[var(--text-muted)] italic">No parameters in this category.</p>
          )}

          {/* Basic params */}
          <div className="space-y-4">
            {basicParams.map((def) => (
              <ParamControl
                key={`${def.key}-${cameraId ?? "global"}`}
                paramDef={def}
                value={getValue(def)}
                onChange={(v) => onParamChange(def.key, v)}
              />
            ))}
          </div>

          {/* Advanced params */}
          {advancedParams.length > 0 && (
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors py-1"
              >
                <svg className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {showAdvanced ? "Hide" : "Show"} Advanced ({advancedParams.length})
              </button>
              {showAdvanced && (
                <div className="space-y-4 mt-3 pl-4 border-l-2 border-[var(--border)]">
                  {advancedParams.map((def) => (
                    <ParamControl
                      key={`${def.key}-${cameraId ?? "global"}-adv`}
                      paramDef={def}
                      value={getValue(def)}
                      onChange={(v) => onParamChange(def.key, v)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
