// ============================================================
// xml-gcamcon — useDebouncedSave Hook
// Debounced persistence to localStorage for UserConfig arrays
// ============================================================

import { useRef, useCallback, useEffect } from "react";
import type { UserConfig } from "@/types";

interface UseDebouncedSaveOptions {
  delayMs?: number;
  onSave?: (configs: UserConfig[]) => void;
}

export function useDebouncedSave(options: UseDebouncedSaveOptions = {}) {
  const { delayMs = 800, onSave } = options;

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestConfigRef = useRef<UserConfig | null>(null);
  const saveFnRef = useRef(onSave);
  saveFnRef.current = onSave;

  // Flush pending save on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        if (latestConfigRef.current) {
          saveFnRef.current?.([latestConfigRef.current]);
        }
      }
    };
  }, []);

  const debouncedUpdate = useCallback(
    (updated: UserConfig, immediateUpdate: (config: UserConfig) => void) => {
      latestConfigRef.current = updated;

      // Update in-memory immediately via callback
      immediateUpdate(updated);

      // Debounce localStorage write
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        if (latestConfigRef.current && saveFnRef.current) {
          saveFnRef.current([latestConfigRef.current]);
        }
      }, delayMs);
    },
    [delayMs]
  );

  const immediateSave = useCallback((updated: UserConfig) => {
    latestConfigRef.current = updated;
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    saveFnRef.current?.([updated]);
  }, []);

  return { debouncedUpdate, immediateSave };
}
