// ============================================================
// xml-gcamcon — LensTabs Component
// Tab navigation for selecting which camera lens to edit
// ============================================================

"use client";

import type { CameraId, CameraSensor, Device } from "@/types";

interface LensTabsProps {
  lensIds: CameraId[];
  activeLens: CameraId | null;
  onSelectLens: (id: CameraId) => void;
  device: Device;
  hasGlobal?: boolean;
  onSelectGlobal?: () => void;
  showGlobal?: boolean;
}

const lensIcons: Record<number, string> = {
  0: "📷",
  1: "🤳",
  2: "🔭",
  3: "🌐",
  4: "🔬",
};

const lensColors: Record<number, string> = {
  0: "#6366f1",
  1: "#a855f7",
  2: "#ec4899",
  3: "#f59e0b",
  4: "#22c55e",
};

export default function LensTabs({
  lensIds,
  activeLens,
  onSelectLens,
  device,
  hasGlobal = false,
  onSelectGlobal,
  showGlobal = false,
}: LensTabsProps) {
  function getSensor(cameraId: CameraId): CameraSensor | undefined {
    return device.sensors.find((s) => s.id === cameraId);
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {showGlobal && (
        <button
          onClick={onSelectGlobal}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
            ${activeLens === null
              ? "bg-[var(--accent)] text-white shadow-[0_0_12px_var(--accent-glow)]"
              : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] border border-[var(--border)]"
            }
          `}
        >
          <span>⚙️</span>
          <span>Global</span>
        </button>
      )}
      {lensIds.map((id) => {
        const sensor = getSensor(id);
        const isActive = activeLens === id;
        const color = lensColors[id] || "#6366f1";

        return (
          <button
            key={id}
            onClick={() => onSelectLens(id)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
              ${isActive
                ? "text-white shadow-lg"
                : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] border border-[var(--border)]"
              }
            `}
            style={isActive ? { backgroundColor: color, boxShadow: `0 0 12px ${color}40` } : undefined}
          >
            <span>{lensIcons[id] || "📸"}</span>
            <span>{sensor?.name || `Camera ${id}`}</span>
            {sensor && (
              <span className="text-[10px] opacity-70">{sensor.megapixels}MP</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
