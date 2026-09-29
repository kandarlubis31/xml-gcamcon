// ============================================================
// xml-gcamcon — ConfigImporter Component
// Import XML config files via upload or drag-and-drop
// ============================================================

"use client";

import { useCallback, useState, useRef, DragEvent } from "react";
import type { GcamPortId, UserConfig } from "@/types";
import { parseConfigXml } from "@/lib/parser";

interface ConfigImporterProps {
  portId: GcamPortId;
  deviceCodename: string;
  onConfigImported: (config: UserConfig) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfigImporter({
  portId,
  deviceCodename,
  onConfigImported,
  isOpen,
  onClose,
}: ConfigImporterProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [pasteContent, setPasteContent] = useState("");
  const [mode, setMode] = useState<"upload" | "paste">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setParsing(true);
      try {
        const text = await file.text();
        const config = parseConfigXml(text, portId, deviceCodename, file.name.replace(/\.(xml|agc)$/, ""));
        onConfigImported(config);
        onClose();
      } catch (e) {
        setError(`Failed to parse XML: ${e instanceof Error ? e.message : "Unknown error"}`);
      } finally {
        setParsing(false);
      }
    },
    [portId, deviceCodename, onConfigImported, onClose]
  );

  const handlePaste = useCallback(() => {
    if (!pasteContent.trim()) {
      setError("Please paste XML content first.");
      return;
    }
    setError(null);
    setParsing(true);
    try {
      const config = parseConfigXml(pasteContent, portId, deviceCodename, "Imported Config");
      onConfigImported(config);
      onClose();
    } catch (e) {
      setError(`Failed to parse XML: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setParsing(false);
    }
  }, [pasteContent, portId, deviceCodename, onConfigImported, onClose]);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="card w-full max-w-lg mx-4 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Import XML Config</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex bg-[var(--bg-tertiary)] rounded-lg p-1">
          <button
            onClick={() => setMode("upload")}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mode === "upload" ? "bg-[var(--accent)] text-white" : "text-[var(--text-secondary)]"}`}
          >
            📁 Upload File
          </button>
          <button
            onClick={() => setMode("paste")}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mode === "paste" ? "bg-[var(--accent)] text-white" : "text-[var(--text-secondary)]"}`}
          >
            📋 Paste XML
          </button>
        </div>

        {mode === "upload" ? (
          <div
            className={`
              border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
              ${dragOver ? "border-[var(--accent)] bg-[var(--accent)]/10" : "border-[var(--border)] hover:border-[var(--accent)]/50"}
            `}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xml,.agc"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <svg className="w-10 h-10 mx-auto text-[var(--text-muted)] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-[var(--text-secondary)]">
              Drop your <code className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-[var(--accent)] font-mono text-xs">.xml</code> or{" "}
              <code className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-[var(--accent)] font-mono text-xs">.agc</code> file here
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">or click to browse</p>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              placeholder="Paste your GCam XML config content here..."
              className="w-full h-40 bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] rounded-xl p-3 text-xs font-mono focus-ring focus:border-[var(--accent)] transition-colors resize-none"
            />
            <button
              onClick={handlePaste}
              disabled={parsing || !pasteContent.trim()}
              className="w-full py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm"
            >
              {parsing ? "Parsing..." : "Parse & Import"}
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <p className="text-xs text-[var(--text-muted)]">
          Supported: BSG MGC (<code>.xml</code>), LMC (<code>.xml</code>), Arnova (<code>.xml</code>), AGC (<code>.agc</code>)
        </p>
      </div>
    </div>
  );
}
