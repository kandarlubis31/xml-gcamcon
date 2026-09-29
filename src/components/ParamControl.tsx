// ============================================================
// xml-gcamcon — ParamControl Component
// Renders the correct input control based on param type
// ============================================================

"use client";

import type { ParamDefinition } from "@/types";

interface ParamControlProps {
  paramDef: ParamDefinition;
  value: number | boolean | string;
  onChange: (value: number | boolean | string) => void;
  disabled?: boolean;
}

export default function ParamControl({ paramDef, value, onChange, disabled }: ParamControlProps) {
  switch (paramDef.type) {
    case "boolean":
      return <ToggleControl paramDef={paramDef} value={value as boolean} onChange={onChange} disabled={disabled} />;
    case "float":
    case "int":
      return <SliderControl paramDef={paramDef} value={value as number} onChange={onChange} disabled={disabled} />;
    case "select":
      return <SelectControl paramDef={paramDef} value={value as string} onChange={onChange} disabled={disabled} />;
    default:
      return <TextControl paramDef={paramDef} value={value as string} onChange={onChange} disabled={disabled} />;
  }
}

function ToggleControl({ paramDef, value, onChange, disabled }: {
  paramDef: ParamDefinition;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none group">
      <button
        role="switch"
        aria-checked={value}
        disabled={disabled}
        onClick={() => onChange(!value)}
        className={`
          relative w-10 h-6 rounded-full transition-all duration-200 focus-ring
          ${value ? "bg-[var(--accent)]" : "bg-[var(--bg-tertiary)] border border-[var(--border)]"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "group-hover:shadow-[0_0_8px_var(--accent-glow)]"}
        `}
      >
        <span
          className={`
            absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200
            ${value ? "translate-x-4" : "translate-x-0"}
          `}
        />
      </button>
      <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
        {paramDef.label}
      </span>
    </label>
  );
}

function SliderControl({ paramDef, value, onChange, disabled }: {
  paramDef: ParamDefinition;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const min = paramDef.min ?? 0;
  const max = paramDef.max ?? 3;
  const step = paramDef.step ?? 0.1;
  const percent = ((value - min) / (max - min)) * 100;
  const defaultValue = typeof paramDef.defaultValue === "number" ? paramDef.defaultValue : (min + max) / 2;
  const isDefault = Math.abs(value - defaultValue) < step / 2;

  const handleDoubleClick = () => {
    if (!disabled) onChange(defaultValue);
  };

  return (
    <div className="space-y-1.5" onDoubleClick={handleDoubleClick} title="Double-click to reset to default">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--text-secondary)]">{paramDef.label}</label>
        <span className={`text-sm font-mono font-bold tabular-nums transition-colors ${isDefault ? "text-[var(--text-muted)]" : "text-[var(--accent)]"}`}>
          {Number(value).toFixed(step < 1 ? 2 : 0)}
          {paramDef.unit && <span className="text-xs ml-0.5 text-[var(--text-muted)]">{paramDef.unit}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Number(value)}
        disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${percent}%, var(--bg-tertiary) ${percent}%, var(--bg-tertiary) 100%)`,
        }}
      />
      <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
        <span>{min}</span>
        <span className={isDefault ? "text-[var(--text-muted)]" : "text-[var(--accent)]/60 text-[9px]"}>
          default: {defaultValue.toFixed(step < 1 ? 2 : 0)}
        </span>
        <span>{max}</span>
      </div>
      {paramDef.description && (
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{paramDef.description}</p>
      )}
    </div>
  );
}

function SelectControl({ paramDef, value, onChange, disabled }: {
  paramDef: ParamDefinition;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[var(--text-secondary)]">{paramDef.label}</label>
      <select
        value={String(value)}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus-ring focus:border-[var(--accent)] transition-colors"
      >
        {paramDef.options?.map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>
      {paramDef.description && (
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{paramDef.description}</p>
      )}
    </div>
  );
}

function TextControl({ paramDef, value, onChange, disabled }: {
  paramDef: ParamDefinition;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[var(--text-secondary)]">{paramDef.label}</label>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus-ring focus:border-[var(--accent)] transition-colors font-mono"
      />
      {paramDef.description && (
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{paramDef.description}</p>
      )}
    </div>
  );
}
