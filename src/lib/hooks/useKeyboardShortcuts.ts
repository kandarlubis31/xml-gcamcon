// ============================================================
// xml-gcamcon — useKeyboardShortcuts Hook
// Centralized keyboard shortcuts for the entire app
// ============================================================

"use client";

import { useEffect, useRef } from "react";

interface ShortcutHandlers {
  onSave?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onNew?: () => void;
  onDuplicate?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onFocusSearch?: () => void;
  onCloseModal?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const h = handlersRef.current;

      // Don't trigger shortcuts when typing in inputs/textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT";

      // Ctrl/Meta + key combos
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "s":
            e.preventDefault();
            h.onSave?.();
            return;
          case "e":
            e.preventDefault();
            h.onExport?.();
            return;
          case "i":
            e.preventDefault();
            h.onImport?.();
            return;
          case "n":
            e.preventDefault();
            h.onNew?.();
            return;
          case "d":
            e.preventDefault();
            h.onDuplicate?.();
            return;
          case "z":
            if (e.shiftKey) {
              e.preventDefault();
              h.onRedo?.();
            } else {
              e.preventDefault();
              h.onUndo?.();
            }
            return;
          case "y":
            e.preventDefault();
            h.onRedo?.();
            return;
        }
      }

      // Single-key shortcuts (only when not typing in inputs)
      if (!isInput) {
        if (e.key === "/") {
          e.preventDefault();
          h.onFocusSearch?.();
          return;
        }
        if (e.key === "Escape") {
          h.onCloseModal?.();
          return;
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
