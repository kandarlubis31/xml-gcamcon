// ============================================================
// xml-gcamcon — Main Page
// Full GCam Config Maker web app
// ============================================================

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { UserConfig } from "@/types";
import { createDefaultConfig } from "@/lib/generator";
import { getDevice } from "@/lib/devices";
import { loadConfigs, saveConfigs, addConfig, deleteConfig, loadActiveConfigId, saveActiveConfigId } from "@/lib/store";
import { useDebouncedSave } from "@/lib/hooks/useDebouncedSave";
import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts";
import { getConfigFromHash, clearConfigHash } from "@/lib/share";
import { generateId } from "@/lib/utils";
import { generateConfigXml } from "@/lib/generator";

import TopBar from "@/components/TopBar";
import ConfigEditor from "@/components/ConfigEditor";
import ConfigImporter from "@/components/ConfigImporter";
import PresetSelector from "@/components/PresetSelector";
import SavedConfigsPanel from "@/components/SavedConfigsPanel";
import ConfigDiff from "@/components/ConfigDiff";

export default function Home() {
  const [config, setConfig] = useState<UserConfig | null>(null);
  const [savedConfigs, setSavedConfigs] = useState<UserConfig[]>([]);
  const [showImporter, setShowImporter] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [activeTab, setActiveTab] = useState<"editor" | "saved">("editor");

  // --- Undo/Redo ---
  const [history, setHistory] = useState<UserConfig[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const historyIndexRef = useRef(-1);

  const pushHistory = useCallback((cfg: UserConfig) => {
    const idx = historyIndexRef.current;
    setHistory((prev) => [...prev.slice(0, idx + 1), cfg].slice(-50));
    historyIndexRef.current = Math.min(idx + 1, 49);
    setHistoryIndex(historyIndexRef.current);
  }, []);

  // Sync ref with state
  useEffect(() => { historyIndexRef.current = historyIndex; }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex < 0 || history.length === 0) return;
    const prev = history[historyIndex];
    setConfig(prev);
    const newIdx = historyIndex - 1;
    setHistoryIndex(newIdx);
    historyIndexRef.current = newIdx;
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    setConfig(next);
    const newIdx = historyIndex + 1;
    setHistoryIndex(newIdx);
    historyIndexRef.current = newIdx;
  }, [history, historyIndex]);

  // --- Compare mode ---
  const [compareLeft, setCompareLeft] = useState<UserConfig | null>(null);
  const [compareRight, setCompareRight] = useState<UserConfig | null>(null);

  // --- Debounced save hook ---
  const savedConfigsRef = useRef(savedConfigs);
  useEffect(() => { savedConfigsRef.current = savedConfigs; }, [savedConfigs]);

  const { debouncedUpdate, immediateSave } = useDebouncedSave({
    delayMs: 800,
    onSave: ([updated]) => {
      const prev = savedConfigsRef.current;
      const idx = prev.findIndex((c) => c.id === updated.id);
      const newList = idx >= 0 ? [...prev.slice(0, idx), updated, ...prev.slice(idx + 1)] : [...prev, updated];
      saveConfigs(newList);
    },
  });

  // Load saved configs + check URL hash on mount
  useEffect(() => {
    const stored = loadConfigs();
    setSavedConfigs(stored);

    // Check URL hash for shared config
    const sharedConfig = getConfigFromHash();
    if (sharedConfig) {
      clearConfigHash();
      setConfig(sharedConfig);
      setSavedConfigs((prev) => {
        const idx = prev.findIndex((c) => c.id === sharedConfig.id);
        const newList = idx >= 0 ? [...prev.slice(0, idx), sharedConfig, ...prev.slice(idx + 1)] : [...prev, sharedConfig];
        saveConfigs(newList);
        return newList;
      });
      return;
    }

    // Restore last active config or create default
    const activeId = loadActiveConfigId();
    if (activeId && stored.length > 0) {
      const found = stored.find((c) => c.id === activeId);
      if (found) {
        setConfig(found);
        return;
      }
    }

    const defaultConfig = createDefaultConfig("bsg", "tissot", "Mi A1 — BSG Config");
    setConfig(defaultConfig);
  }, []);

  // Persist active config ID
  useEffect(() => {
    if (config) saveActiveConfigId(config.id);
  }, [config?.id]);

  // --- Handlers ---

  const handleConfigChange = useCallback((updated: UserConfig) => {
    if (config && config !== updated) pushHistory(config);
    setConfig(updated);
    debouncedUpdate(updated, (u) => {
      setSavedConfigs((prev) => {
        const idx = prev.findIndex((c) => c.id === u.id);
        return idx >= 0 ? [...prev.slice(0, idx), u, ...prev.slice(idx + 1)] : [...prev, u];
      });
    });
  }, [config, debouncedUpdate, pushHistory]);

  const handleImport = useCallback((imported: UserConfig) => {
    if (config) pushHistory(config);
    setConfig(imported);
    immediateSave(imported);
    setSavedConfigs((prev) => {
      const idx = prev.findIndex((c) => c.id === imported.id);
      return idx >= 0 ? [...prev.slice(0, idx), imported, ...prev.slice(idx + 1)] : [...prev, imported];
    });
  }, [config, immediateSave, pushHistory]);

  const handleSave = useCallback(() => {
    if (!config) return;
    setSavedConfigs((prev) => addConfig(config));
  }, [config]);

  const handleLoadSaved = useCallback((saved: UserConfig) => {
    if (config && config.id !== saved.id) pushHistory(config);
    setConfig(saved);
    setActiveTab("editor");
    setHistoryIndex(-1);
    setHistory([]);
  }, [config, pushHistory]);

  const handleDeleteSaved = useCallback((id: string) => {
    setSavedConfigs((prev) => deleteConfig(id));
  }, []);

  const handleDuplicate = useCallback((source: UserConfig) => {
    const dup: UserConfig = {
      ...source,
      id: generateId(),
      name: `${source.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSavedConfigs((prev) => addConfig(dup));
  }, []);

  const handleCompare = useCallback((a: UserConfig, b: UserConfig) => {
    setCompareLeft(a);
    setCompareRight(b);
  }, []);

  // Export handler (for keyboard shortcut)
  const handleExport = useCallback(() => {
    if (!config) return;
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
    } catch { /* handled in TopBar */ }
  }, [config]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSave: handleSave,
    onExport: handleExport,
    onImport: () => setShowImporter(true),
    onUndo: undo,
    onRedo: redo,
    onFocusSearch: () => {
      document.querySelector<HTMLInputElement>('[placeholder="Search parameters..."]')?.focus();
    },
    onCloseModal: () => {
      setShowImporter(false);
      setShowPresets(false);
      setCompareLeft(null);
      setCompareRight(null);
    },
  });

  const device = config ? getDevice(config.deviceCodename) : null;

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/30">
            📸
          </div>
          <h1 className="text-xl font-bold gradient-text">xml-gcamcon</h1>
          <p className="text-sm text-[var(--text-secondary)]">Loading your GCam config maker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
        {/* Top Bar */}
        <TopBar
          config={config}
          onConfigChange={handleConfigChange}
          onImport={() => setShowImporter(true)}
          onPresets={() => setShowPresets(true)}
          onSave={handleSave}
          onUndo={undo}
          onRedo={redo}
          canUndo={historyIndex >= 0}
          canRedo={historyIndex < history.length - 1}
          savedConfigsCount={savedConfigs.length}
        />

        {/* Tabs: Editor | Saved Configs */}
        <div className="flex bg-[var(--bg-card)] rounded-xl p-1 border border-[var(--border)]">
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === "editor" ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            🔧 Editor
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === "saved" ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            💾 Saved Configs {savedConfigs.length > 0 && `(${savedConfigs.length})`}
          </button>
        </div>

        {/* Content */}
        {activeTab === "editor" ? (
          <ConfigEditor config={config} onConfigChange={handleConfigChange} />
        ) : (
          <SavedConfigsPanel
            configs={savedConfigs}
            activeConfigId={config.id}
            onLoad={handleLoadSaved}
            onDelete={handleDeleteSaved}
            onDuplicate={handleDuplicate}
            onCompare={handleCompare}
          />
        )}

        {/* Device info card */}
        {device && activeTab === "editor" && (
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">📱 Device Info: {device.brand} {device.model}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <InfoBadge label="Chipset" value={device.chipset} />
              <InfoBadge label="Android" value={device.androidVersion} />
              <InfoBadge label="Camera2 API" value={device.camera2ApiLevel} />
              <InfoBadge label="Sensors" value={`${device.sensors.length} lenses`} />
            </div>
            {device.notes && (
              <p className="text-xs text-[var(--text-muted)] mt-3 leading-relaxed">💡 {device.notes}</p>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <ConfigImporter
        portId={config.portId}
        deviceCodename={config.deviceCodename}
        onConfigImported={handleImport}
        isOpen={showImporter}
        onClose={() => setShowImporter(false)}
      />
      <PresetSelector
        portId={config.portId}
        deviceCodename={config.deviceCodename}
        onPresetApplied={handleImport}
        isOpen={showPresets}
        onClose={() => setShowPresets(false)}
      />
      <ConfigDiff
        left={compareLeft!}
        right={compareRight!}
        isOpen={compareLeft !== null && compareRight !== null}
        onClose={() => { setCompareLeft(null); setCompareRight(null); }}
      />
    </div>
  );
}

// --- Info Badge ---
function InfoBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--bg-tertiary)] rounded-lg px-3 py-2">
      <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">{label}</p>
      <p className="text-xs text-[var(--text-primary)] font-medium mt-0.5">{value}</p>
    </div>
  );
}
