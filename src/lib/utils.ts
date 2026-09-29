// ============================================================
// xml-gcamcon — Utils
// ============================================================

/** SSR-safe UUID generation. Falls back to timestamp+random if crypto is unavailable. */
export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}
