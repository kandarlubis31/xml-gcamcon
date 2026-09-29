// ============================================================
// xml-gcamcon — DeviceSelect Component
// Searchable dropdown for device selection, grouped by brand
// ============================================================

"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { Device, CameraSensor } from "@/types";

interface DeviceSelectProps {
  devices: Device[];
  value: string;
  onChange: (codename: string) => void;
}

const sensorIcons: Record<number, string> = {
  0: "📷",
  1: "🤳",
  2: "🔭",
  3: "🌐",
  4: "🔬",
};

export default function DeviceSelect({ devices, value, onChange }: DeviceSelectProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const selectedDevice = devices.find((d) => d.codename === value);

  const grouped = useMemo(() => {
    const term = search.toLowerCase();
    const filtered = devices.filter(
      (d) =>
        d.model.toLowerCase().includes(term) ||
        d.brand.toLowerCase().includes(term) ||
        d.codename.includes(term)
    );
    return Object.groupBy(filtered, (d) => d.brand);
  }, [search, devices]);

  const handleSelect = (codename: string) => {
    onChange(codename);
    setOpen(false);
    setSearch("");
  };

  const mainSensor = (sensors: CameraSensor[]) =>
    sensors.find((s) => s.id === 0);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus-ring focus:border-[var(--accent)] transition-colors text-left flex items-center justify-between gap-2"
      >
        <span className="truncate">
          {selectedDevice
            ? `${selectedDevice.brand} ${selectedDevice.model}`
            : "Select device..."}
        </span>
        <svg
          className={`w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-[var(--border)]">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search devices..."
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>

          {/* Device list */}
          <div className="max-h-64 overflow-y-auto">
            {Object.keys(grouped).length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] text-center py-6">
                No devices found for &quot;{search}&quot;
              </p>
            ) : (
              Object.entries(grouped).map(([brand, devs]) => (
                <div key={brand}>
                  <div className="px-3 py-1.5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider bg-[var(--bg-tertiary)]/50">
                    {brand}
                  </div>
                  {devs!.map((d) => {
                    const main = mainSensor(d.sensors);
                    const isActive = d.codename === value;
                    return (
                      <button
                        key={d.codename}
                        type="button"
                        onClick={() => handleSelect(d.codename)}
                        className={`w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-[var(--bg-tertiary)] transition-colors text-sm ${
                          isActive ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[var(--text-primary)]"
                        }`}
                      >
                        <span className="text-base shrink-0">
                          {main ? sensorIcons[main.id] ?? "📸" : "📸"}
                        </span>
                        <div className="min-w-0">
                          <span className="font-medium">
                            {highlightMatch(d.model, search)}
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)] ml-1.5">
                            {d.codename}
                          </span>
                        </div>
                        {main && (
                          <span className="text-[10px] text-[var(--text-muted)] ml-auto shrink-0">
                            {main.megapixels}MP
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Highlight matching substring in text */
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[var(--accent)]/30 text-[var(--accent)] rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}
