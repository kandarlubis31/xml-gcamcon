// ============================================================
// xml-gcamcon — TopBar Component
// App header with port/device selectors, import, export, save actions
// ============================================================

"use client";

import { useState, useCallback } from "react";
import type { UserConfig, GcamPortId } from "@/types";
import { generateConfigXml, createDefaultConfig } from "@/lib/generator";
import { devices } from "@/lib/devices";
import { gcamPortList } from "@/lib/schemas";
import { buildShareUrl } from "@/lib/share";
import DeviceSelect from "./DeviceSelect";
import ThemeToggle from "./ThemeToggle";

interface TopBarProps {
  config: UserConfig;
  onConfigChange: (config: UserConfig) => void;
  onImport: () => void;
  onPresets: () => void;
  onSave: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  savedConfigsCount: number;
}

export default function TopBar({
  config,
  onConfigChange,
  onImport,
  onPresets,
  onSave,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  savedConfigsCount,
}: TopBarProps) {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleExport = () => {
    try {
      const xml = generateConfigXml(config);
      const blob = new Blob([xml], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeName = config.name.replace(/[^a-z0-9_-]/gi, "_").toLowerCase();
      a.download = `${safeName}_${config.portId}_${config.deviceCodename}.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Config exported successfully!");
    } catch (e) {
      showToast("Export failed: " + (e instanceof Error ? e.message : "Unknown error"), "error");
    }
  };

  const handlePortChange = (portId: GcamPortId) => {
    // Reset config to new port's defaults to avoid stale params from other port schemas
    const freshConfig = createDefaultConfig(portId, config.deviceCodename, config.name.replace(/\([A-Z]+\)$/, "").trim());
    onConfigChange(freshConfig);
  };

  const handleCopyXml = useCallback(async () => {
    try {
      const xml = generateConfigXml(config);
      await navigator.clipboard.writeText(xml);
      showToast("XML copied to clipboard!");
    } catch (e) {
      showToast("Copy failed: " + (e instanceof Error ? e.message : "Unknown error"), "error");
    }
  }, [config]);

  const handleShareLink = useCallback(async () => {
    try {
      const url = buildShareUrl(config);
      await navigator.clipboard.writeText(url);
      showToast("Share link copied!");
    } catch (e) {
      showToast("Copy failed: " + (e instanceof Error ? e.message : "Unknown error"), "error");
    }
  }, [config]);

  const handleDeviceChange = (codename: string) => {
    onConfigChange({ ...config, deviceCodename: codename });
  };

  const handleNameChange = (name: string) => {
    onConfigChange({ ...config, name });
  };

  return (
    <>
      <header className="card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
              📸
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">xml-gcamcon</h1>
              <p className="text-xs text-[var(--text-muted)]">GCam Config Maker</p>
            </div>
            <ThemeToggle />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-1.5">
            {/* Undo/Redo */}
            <button
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className="px-2 py-2 text-xs font-semibold bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg border border-[var(--border)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ↶
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo (Ctrl+Shift+Z)"
              className="px-2 py-2 text-xs font-semibold bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg border border-[var(--border)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ↷
            </button>
            <button
              onClick={onPresets}
              className="px-3 py-2 text-xs font-semibold bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg border border-[var(--border)] transition-all flex items-center gap-1.5"
            >
              📋 Templates
            </button>
            <button
              onClick={onImport}
              className="px-3 py-2 text-xs font-semibold bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg border border-[var(--border)] transition-all flex items-center gap-1.5"
            >
              📥 Import
            </button>
            <button
              onClick={handleExport}
              className="px-3 py-2 text-xs font-semibold bg-[var(--success)]/20 hover:bg-[var(--success)]/30 text-[var(--success)] rounded-lg border border-[var(--success)]/30 transition-all flex items-center gap-1.5"
            >
              📤 Export XML
            </button>
            <button
              onClick={handleCopyXml}
              className="px-3 py-2 text-xs font-semibold bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg border border-[var(--border)] transition-all flex items-center gap-1.5"
              title="Copy XML to clipboard"
            >
              📋 Copy XML
            </button>
            <button
              onClick={handleShareLink}
              className="px-3 py-2 text-xs font-semibold bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg border border-[var(--border)] transition-all flex items-center gap-1.5"
              title="Copy shareable link"
            >
              🔗 Share
            </button>
            <button
              onClick={onSave}
              className="px-3 py-2 text-xs font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-lg transition-all flex items-center gap-1.5 glow"
            >
              💾 Save
            </button>
          </div>
        </div>

        {/* Config meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Config Name</label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus-ring focus:border-[var(--accent)] transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">GCam Port</label>
            <select
              value={config.portId}
              onChange={(e) => handlePortChange(e.target.value as GcamPortId)}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus-ring focus:border-[var(--accent)] transition-colors"
            >
              {gcamPortList.map((port) => (
                <option key={port.id} value={port.id}>
                  {port.name} ({port.recommendedVersion})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Device</label>
            <DeviceSelect
              devices={devices}
              value={config.deviceCodename}
              onChange={handleDeviceChange}
            />
          </div>
        </div>

        {/* Saved indicator */}
        {savedConfigsCount > 0 && (
          <p className="text-xs text-[var(--text-muted)]">
            💾 {savedConfigsCount} config{savedConfigsCount > 1 ? "s" : ""} saved in browser
          </p>
        )}
      </header>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 toast-enter px-4 py-3 rounded-xl text-sm font-medium shadow-lg ${
          toast.type === "error" ? "bg-red-500/90 text-white" : "bg-[var(--success)]/90 text-white"
        }`}>
          {toast.message}
        </div>
      )}
    </>
  );
}
