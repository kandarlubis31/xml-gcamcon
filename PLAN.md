# 🗺️ xml-gcamcon — Improvement Roadmap

> **Status:** v0.1.0 MVP ✅ | **Last Updated:** July 2026
>
> GCam Config Maker — Web-based tool to create, edit, import & export GCam XML configs.

---

## 📊 Current State

| Feature | Status |
|---------|--------|
| 4 GCam port schemas (BSG, LMC, Arnova, AGC) | ✅ |
| 23 devices in database | ✅ |
| Visual config editor (per-lens, per-category) | ✅ |
| XML import (upload + drag-drop + paste) | ✅ |
| XML export (download) | ✅ |
| 5 preset templates (Mi A1 optimized) | ✅ |
| localStorage persistence (debounced) | ✅ |
| Dark theme UI | ✅ |
| TypeScript strict mode | ✅ |
| Production build verified | ✅ |

### ⚠️ Known Gaps (from code review)

| Gap | Severity | Fix in |
|-----|----------|--------|
| `PresetSelector` only loads `miA1Presets` — ignores device filter | Medium | STEP 2 |
| No favicon / app icons / manifest.json | Low | Phase 3.2 |
| No "Reset param to default" (double-click slider) | Medium | Phase 1 ⭐ NEW |
| No "Duplicate config" button | Low | Phase 2.4 |
| No "Copy XML to clipboard" (only download) | Low | Phase 2.5 |
| Debounced save logic is 60 lines inline in `page.tsx` — should be a hook | Medium | Phase 3 ⭐ NEW |
| No error boundary — JSON parse crash in localStorage kills the app | High | Phase 3 ⭐ NEW |
| No loading skeleton / shimmer states | Low | Phase 1 ⭐ NEW |
| Parser doesn't detect `.agc` vs `.xml` format differences | Low | Phase 2.5 |
| Presets hardcode `tissot` device — switching device doesn't filter presets | High | STEP 2 |
| No mobile responsive testing / viewport optimization | Medium | Phase 1 ⭐ NEW |
| Export uses manual DOM manipulation (`document.createElement("a")`) | Low | Phase 3 |
| No unit tests at all | High | Phase 3.1 |

---

## 🔥 Phase 1 — Polish & UX (Quick Wins)

### 1.0 🆕 Code Cleanup & Bug Fixes (DO FIRST)
- [ ] **Extract debounced save logic** from `page.tsx` → `src/lib/hooks/useDebouncedSave.ts`
  - Reduce `page.tsx` from ~300 lines to ~200
  - Reusable for other state persistence needs
- [ ] **Add ErrorBoundary** component wrapping the entire app
  - Catch JSON parse errors from corrupted localStorage
  - Show friendly "Something went wrong" with "Reset all data" button
- [ ] **Mobile responsive pass**
  - Test on 375px viewport (iPhone SE)
  - Stack TopBar buttons vertically on mobile
  - Make slider thumbs larger for touch (24px min)
  - Ensure modals don't overflow on small screens
- [ ] **Dark/Light CSS variable audit** — ensure ALL colors use CSS variables (no hardcoded `#xxx`)

### 1.1 Config Validation
- [ ] Warn when slider values go outside "recommended" range
- [ ] Show ⚠️ badge next to params that deviate from device-specific safe ranges
- [ ] Validate output XML format against port schema before export

### 1.2 Undo / Redo
- [ ] Store edit history stack (last 50 changes)
- [ ] Ctrl+Z / Ctrl+Y keyboard shortcuts
- [ ] Visual indicator when there are unsaved changes

### 1.3 Keyboard Shortcuts
- [ ] `Ctrl+S` — Save config
- [ ] `Ctrl+E` — Export XML
- [ ] `Ctrl+I` — Import XML
- [ ] `Ctrl+N` — New blank config
- [ ] `Ctrl+D` — Duplicate current config
- [ ] `/` — Focus search bar
- [ ] `Escape` — Close any open modal

### 1.4 Device Dropdown UX
- [ ] Search/filter field inside device dropdown (23 devices too many to scroll)
- [ ] Group by brand (Xiaomi / Samsung / Google / OnePlus / ASUS / Nothing)
- [ ] Show sensor icon + MP count in dropdown items

### 1.5 Theme Toggle
- [ ] Dark / Light / System theme switch
- [ ] Persist theme preference in localStorage
- [ ] CSS variables already support this (just toggle `dark` class)

### 1.6 Toast Notifications
- [ ] "Config saved" toast on Ctrl+S
- [ ] "Config exported" toast on download
- [ ] "Undo applied" / "Redo applied" toast
- [ ] "Link copied!" toast on share

### 1.7 🆕 Micro-interactions & Polish
- [ ] **Double-click slider to reset** to default value
- [ ] **Right-click param label** → "Reset to default" context menu
- [ ] **Loading skeleton** while config loads from localStorage
- [ ] **Hover tooltip** on param labels showing description
- [ ] **Animated value change** — brief pulse animation when value changes
- [ ] **Smooth category expand/collapse** with height animation
- [ ] **Empty state illustrations** for: no saved configs, no search results, no presets
- [ ] **Confirmation dialog** before: delete config, switch port (loses params), load preset (overwrites)

### 1.8 🆕 Favicon & Branding
- [ ] Create `favicon.ico` (camera + gear icon)
- [ ] Add `apple-touch-icon.png`
- [ ] Add `<meta name="theme-color">` in layout.tsx
- [ ] Open Graph meta tags for social sharing

---

## 🚀 Phase 2 — Feature Expansion

### 2.1 More Presets Per Device
- [ ] Redmi Note 10 Pro (`sweet`) — Natural / Night / Vivid
- [ ] POCO X3 NFC (`surya`) — Natural / Night
- [ ] Nothing Phone 2 (`pong`) — Natural / Vivid
- [ ] POCO F1 (`beryllium`) — Natural / Night / Vivid
- [ ] Dynamic preset loading based on selected device
- [ ] **Fix:** `PresetSelector` must filter presets by `deviceCodename` from props

### 2.2 Config Sharing via URL
- [ ] Encode entire config as URL hash (`#config=base64json`)
- [ ] "Copy Share Link" button
- [ ] On load, check URL hash and auto-import config
- [ ] Warn before overwriting existing config
- [ ] **Compress** large configs with LZ-String to keep URLs short

### 2.3 Config Diff / Compare
- [ ] Side-by-side diff view between two saved configs
- [ ] Highlight changed values in green/red
- [ ] "Compare with..." dropdown in Saved Configs panel
- [ ] Show summary: "X params changed, Y added, Z removed"

### 2.4 Batch Operations
- [ ] Export all saved configs as ZIP
- [ ] Delete multiple configs at once (checkbox mode)
- [ ] **Duplicate config** — one-click copy of current config
- [ ] **Rename** config from Saved Configs panel (inline edit)

### 2.5 Export Formats
- [ ] `.xml` (current) ✅
- [ ] `.agc` (AGC Toolkit format — same XML, different extension)
- [ ] **Copy XML to clipboard** directly (no download needed)
- [ ] **Preview XML** raw text before download (modal with syntax highlight)
- [ ] Detect `.agc` format on import and auto-set port to AGC

### 2.6 Per-Lens Presets
- [ ] Independent presets for Main / Tele / Front lens on same config
- [ ] "Copy settings from Main to Tele" button
- [ ] Per-lens preset library (e.g., "Portrait selfie preset" for front cam)

### 2.7 🆕 Param Value Snapshot
- [ ] **Star/bookmark individual param values** for quick reference
- [ ] **Recently used values** dropdown on sliders
- [ ] **Param value history** per key (last 5 values used)

---

## 🏗️ Phase 3 — Architecture & DX

### 3.0 🆕 Code Quality (DO FIRST)
- [ ] **Extract `useDebouncedSave` hook** from `page.tsx`
- [ ] **Add `ErrorBoundary`** component
- [ ] **Add `useKeyboardShortcuts` hook** (centralize all shortcuts)
- [ ] **Split `page.tsx`** — extract `SavedConfigsPanel` to own file
- [ ] **Add JSDoc** to all exported functions in `lib/`
- [ ] **Add `eslint-plugin-react-hooks`** rules for exhaustive deps
- [ ] **Configure `eslint`** to error on `any` types

### 3.1 Testing
- [ ] Unit tests for `parser.ts` — valid/invalid/malformed XML input
- [ ] Unit tests for `generator.ts` — roundtrip (generate → parse → compare)
- [ ] Unit tests for `updateConfigParam` — per-lens vs global mutations
- [ ] Unit tests for `store.ts` — localStorage read/write
- [ ] Component tests for key UI interactions
- [ ] E2E test: load page → select device → edit param → export → import → verify
- [ ] **Snapshot tests** for XML output format
- [ ] **Setup Vitest** (fast, native ESM, works with Next.js)

### 3.2 PWA Support
- [ ] `manifest.json` — app name, icons, theme color
- [ ] Service worker for offline caching
- [ ] "Install as App" prompt
- [ ] Works fully offline (localStorage only, no backend)

### 3.3 Performance
- [ ] Virtualize device dropdown (react-window) if >50 devices
- [ ] **Memoize `CategoryPanel`** with `React.memo` to avoid re-renders
- [ ] **Debounce search input** (currently filters on every keystroke)
- [ ] Lazy-load device database (dynamic import)
- [ ] Compress localStorage payload (remove redundant default params)
- [ ] **Add `useMemo`/`useCallback`** audit across all components

### 3.4 Accessibility
- [ ] Full keyboard navigation (Tab through all controls)
- [ ] ARIA labels on all interactive elements
- [ ] Screen reader announcements for config changes
- [ ] Focus trap in modals (Import, Presets)
- [ ] Fix form field label warnings from Lighthouse
- [ ] **Color contrast audit** — ensure WCAG AA compliance

### 3.5 🆕 CI/CD
- [ ] **GitHub Actions** workflow:
  - `pnpm lint` on PR
  - `pnpm build` on PR
  - `pnpm test` on PR (once tests exist)
- [ ] **Pre-commit hook** (husky + lint-staged) for auto-format
- [ ] **CHANGELOG.md** with standard keep-a-changelog format

---

## 🌍 Phase 4 — Community & Sharing

### 4.1 Community Presets Gallery
- [ ] GitHub-based preset repository (static JSON)
- [ ] "Browse Community Presets" modal
- [ ] Submit preset form → creates GitHub issue/PR
- [ ] Upvote / popular presets sorting

### 4.2 Device Contribution
- [ ] "Request a device" form
- [ ] "Submit device specs" with validation
- [ ] Auto-generate device entry from GSMArena URL

### 4.3 GCam Version Compatibility Matrix
- [ ] Show which GCam ports are tested per device
- [ ] "Known working" badge per device-port combo
- [ ] Community-reported compatibility status

### 4.4 Config Rating System
- [ ] 1-5 star rating on community presets
- [ ] "Most downloaded this week" section
- [ ] Verified badge for tested configs

---

## 🚢 Phase 5 — Deployment & Distribution

### 5.1 Vercel Deployment
- [ ] Deploy to Vercel (free tier)
- [ ] Custom domain (e.g., `gcamcon.app`)
- [ ] Auto-deploy on push to `main`

### 5.2 Analytics
- [ ] Page view tracking (Plausible — privacy-friendly, no cookies)
- [ ] Most popular devices / ports
- [ ] Export / import success rates

### 5.3 SEO
- [ ] `sitemap.xml` generation
- [ ] Meta tags per device page (`/device/tissot`)
- [ ] Open Graph preview images
- [ ] Structured data for Google indexing

---

---

## 🎯 EXECUTION PLAN — v0.2.0

Urutan eksekusi linear, dari paling cepet ke paling impactful.

---

### STEP 0: Code Cleanup & Bug Fixes 🧹 *(NEW — do this first!)*

**Goal:** Bersihin technical debt sebelum nambah fitur. Fix critical bugs.

**Files:**
- `src/app/page.tsx` — extract debounced save, split SavedConfigsPanel
- NEW: `src/lib/hooks/useDebouncedSave.ts`
- NEW: `src/components/ErrorBoundary.tsx`
- NEW: `src/components/SavedConfigsPanel.tsx`
- `src/app/layout.tsx` — wrap with ErrorBoundary
- `src/app/globals.css` — add mobile responsive fixes

**Steps:**
1. Extract `useDebouncedSave` hook — bikin `src/lib/hooks/` directory
2. Bikin `ErrorBoundary.tsx` — catch render errors + localStorage corruption
3. Extract `SavedConfigsPanel` ke file sendiri
4. Wrap `<ErrorBoundary>` di `layout.tsx`
5. Mobile responsive audit — test di 375px, fix overflow/stacking
6. CSS variables audit — ganti semua hardcoded colors
7. Typecheck ✅ + `pnpm build` ✅

---

### STEP 1: Device Dropdown Search/Filter 🔍

**Goal:** Device dropdown (23 devices) susah di-scroll, kasih search bar + group by brand.

**Files:**
- `src/components/TopBar.tsx` — device select section
- NEW: `src/components/DeviceSelect.tsx` — custom searchable dropdown

**Pseudo-code:**
```tsx
// DeviceSelect.tsx — custom component pengganti <select>
function DeviceSelect({ value, onChange, devices }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  
  const grouped = useMemo(() => {
    const filtered = devices.filter(d => 
      d.model.toLowerCase().includes(search) || 
      d.brand.toLowerCase().includes(search) ||
      d.codename.includes(search)
    );
    return Object.groupBy(filtered, d => d.brand);
  }, [search]);
  
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="...">
        {devices.find(d => d.codename === value)?.model ?? "Select device"}
      </button>
      {open && (
        <div className="absolute z-30 ...">
          <input autoFocus value={search} onChange={...} placeholder="Search devices..." />
          {Object.entries(grouped).map(([brand, devs]) => (
            <div key={brand}>
              <div className="text-[10px] uppercase ...">{brand}</div>
              {devs.map(d => (
                <button key={d.codename} onClick={() => { onChange(d.codename); setOpen(false); }}>
                  📷 {d.model} ({d.codename})
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Steps:**
1. Bikin `src/components/DeviceSelect.tsx` — custom searchable dropdown
2. Group devices by `brand` pake `Object.groupBy` (ES2024, supported in Next.js 16)
3. Search filter by model name, brand, or codename
4. Highlight matching text in results
5. Click outside to close
6. Ganti `<select>` di `TopBar.tsx` jadi `<DeviceSelect>`
7. Typecheck ✅

---

### STEP 2: More Presets — Redmi Note 10 Pro (sweet) + POCO X3 NFC (surya) + Fix PresetSelector

**Goal:** Tambah preset configs buat device populer + fix PresetSelector biar filter by device.

**Files:**
- `src/lib/presets.ts` — tambah preset functions + `allPresets` export
- `src/components/PresetSelector.tsx` — fix import, filter by device

**Pseudo-code:**
```ts
// presets.ts — extend
export function generateSweetPresets(): PresetTemplate[] {
  // Redmi Note 10 Pro — 108MP HM2, SD732G
  // HDR frames can go higher (15-21) since SD732G > SD625
  const natural = createDefaultConfig("bsg", "sweet", "RN10 Pro Natural");
  const updated = applyUpdates(natural, [
    { key: "lib_sharpness", value: 1.3, cameraId: 0 },
    { key: "hdr_frames", value: "15" },
    { key: "awb_model", value: "pixel6pro" },
    { key: "sabre_enabled", value: true },
    { key: "pref_qjpg_key", value: "97" },
  ]);
  // ... night, vivid variants
}

export const sweetPresets = generateSweetPresets();
export const suryaPresets = generateSuryaPresets();

// Combine all presets
export const allPresets: PresetTemplate[] = [...miA1Presets, ...sweetPresets, ...suryaPresets];
```

```tsx
// PresetSelector.tsx — ganti import
import { allPresets } from "@/lib/presets";  // was: miA1Presets

// Filter by device & port
const devicePresets = allPresets.filter(p => p.deviceCodename === deviceCodename);
const filtered = filter === "all" 
  ? devicePresets 
  : devicePresets.filter(p => p.portId === filter || p.tags.includes(filter));
```

**Steps:**
1. Riset nilai optimal buat HM2 (108MP) di Redmi Note 10 Pro
2. Riset nilai optimal buat IMX682 (64MP) di POCO X3 NFC
3. Bikin `generateSweetPresets()` — 3 presets (Natural, Night, Vivid)
4. Bikin `generateSuryaPresets()` — 2 presets (Natural, Night)
5. Export `allPresets` dari `presets.ts`
6. Update `PresetSelector.tsx`:
   - Import `allPresets` instead of `miA1Presets`
   - Filter presets by `deviceCodename` prop
   - Show "No presets for this device yet" empty state
7. Typecheck ✅

---

### STEP 3: Config Sharing via URL 🔗

**Goal:** Encode config jadi URL hash biar bisa share ke temen. Buka link → auto-import config.

**Files:**
- NEW: `src/lib/share.ts` — encode/decode config to URL
- `src/components/TopBar.tsx` — "Copy Share Link" button
- `src/app/page.tsx` — check URL hash on load

**Pseudo-code:**
```ts
// share.ts
import type { UserConfig } from "@/types";

function encodeConfig(config: UserConfig): string {
  const json = JSON.stringify(config);
  return btoa(unescape(encodeURIComponent(json)));
}

function decodeConfig(hash: string): UserConfig | null {
  try {
    const json = decodeURIComponent(escape(atob(hash)));
    return JSON.parse(json);
  } catch { return null; }
}

export function buildShareUrl(config: UserConfig): string {
  const base = window.location.origin + window.location.pathname;
  return `${base}#config=${encodeConfig(config)}`;
}

export function getConfigFromHash(): UserConfig | null {
  if (typeof window === "undefined") return null;
  const match = window.location.hash.match(/^#config=(.+)/);
  return match ? decodeConfig(match[1]) : null;
}
```

**Steps:**
1. Bikin `src/lib/share.ts` — encode/decode
2. Di `page.tsx` — tambah `useEffect` cek `getConfigFromHash()` pas load
   - Kalau ada config di hash → prompt user "Config ditemukan di link, load?"
   - Kalau OK → import + hapus hash biar gak loop
3. Di `TopBar.tsx` — tambah tombol "🔗 Share"
   - Panggil `buildShareUrl(config)`
   - Copy ke clipboard pake `navigator.clipboard.writeText()`
   - Toast: "Link copied!"
4. Typecheck ✅

---

### STEP 4: Theme Toggle (Dark/Light/System) 🌓

**Goal:** User bisa switch dark ↔ light ↔ system theme.

**Files:**
- NEW: `src/components/ThemeToggle.tsx`
- `src/components/TopBar.tsx` — tambah theme toggle button
- `src/app/layout.tsx` — baca theme dari localStorage pas load
- `src/lib/store.ts` — tambah `saveThemePreference()` / `loadThemePreference()`

**Steps:**
1. Bikin `ThemeToggle` component
2. Tambah `saveThemePreference` / `loadThemePreference` di `store.ts`
3. Taruh di TopBar (sebelah logo/title)
4. Cycle: dark → light → system → dark
5. Pake CSS variables yg udah ada — cuma toggle class `dark` di `<html>`
6. Light theme CSS variables di `globals.css`
7. Typecheck ✅

---

### STEP 5: Keyboard Shortcuts ⌨️

**Goal:** Ctrl+S save, Ctrl+E export, Ctrl+I import, `/` search, Escape close modal.

**Files:**
- NEW: `src/lib/hooks/useKeyboardShortcuts.ts`
- `src/app/page.tsx` — use the hook
- `src/components/ConfigEditor.tsx` — `/` focus search

**Steps:**
1. Bikin `useKeyboardShortcuts` hook (centralized)
2. Ctrl+S → save
3. Ctrl+E → export
4. Ctrl+I → buka import modal
5. Ctrl+D → duplicate config
6. Ctrl+Z / Ctrl+Y → undo/redo (integrate with STEP 7)
7. `/` → focus search bar
8. `Escape` → close any open modal
9. Typecheck ✅

---

### STEP 6: Config Diff / Compare 📊

**Goal:** Side-by-side comparison 2 config — liat apa aja yg beda.

**Files:**
- NEW: `src/components/ConfigDiff.tsx` — diff view
- NEW: `src/lib/diff.ts` — computeDiff utility
- `src/app/page.tsx` — "Compare" mode

**Steps:**
1. Bikin `computeDiff()` utility — iterate semua params, flag yg berbeda
2. Bikin `ConfigDiff` component — side-by-side view
3. Di Saved Configs panel — tambah "Compare" button
4. Buka compare modal dengan 2 config terpilih
5. Show summary stats: "12 params changed, 3 added, 1 removed"
6. Typecheck ✅

---

### STEP 7: Undo/Redo ↩️

**Goal:** Undo/redo perubahan param di editor.

**Files:**
- `src/app/page.tsx` — undo/redo stack (or extract to hook)
- `src/components/TopBar.tsx` — undo/redo buttons

**Steps:**
1. Tambah `history` array + `historyIndex` state di page.tsx (atau extract ke `useUndoRedo` hook)
2. Update `handleConfigChange` buat push ke history
3. Bikin `undo()` / `redo()` functions
4. Tambah ↶ ↷ buttons di TopBar (disabled state when can't undo/redo)
5. Ctrl+Z / Ctrl+Y integration (from STEP 5 hook)
6. Typecheck ✅

---

### STEP 8: "Reset to Default" on Params 🔄 *(NEW)*

**Goal:** Double-click slider balikin ke default value. Right-click label → "Reset" context menu.

**Files:**
- `src/components/ParamControl.tsx` — double-click handler on slider
- `src/components/CategoryPanel.tsx` — pass `defaultValue` to ParamControl

**Steps:**
1. Tambah `onDoubleClick` handler di `SliderControl` — reset ke `paramDef.defaultValue`
2. Visual feedback: brief pulse animation on reset
3. Tambah `title="Double-click to reset"` tooltip
4. Typecheck ✅

---

## 📋 Execution Checklist

Urutan pengerjaan — satu per satu, typecheck + build tiap step:

```
v0.2.0 — Phase 1 Complete
├── [ ] STEP 0: Code Cleanup + ErrorBoundary + Mobile  (~3 files baru, 4 files edit)
├── [ ] STEP 1: Device Dropdown Search                   (~1 file baru, 1 file edit)
├── [ ] STEP 2: More Presets + Fix PresetSelector        (~1 file edit)
├── [ ] STEP 3: Config Sharing via URL                   (~1 file baru, 2 file edit)
├── [ ] STEP 4: Theme Toggle                             (~1 file baru, 3 file edit)
├── [ ] STEP 5: Keyboard Shortcuts                       (~1 hook baru, 2 file edit)
├── [ ] STEP 6: Config Diff/Compare                      (~1 komponen baru, 1 util, 1 edit)
├── [ ] STEP 7: Undo/Redo                                (~2 file edit)
├── [ ] STEP 8: Reset to Default (double-click)          (~1 file edit)
└── [ ] FINAL: pnpm lint && pnpm build && browser test
```

---

## 📝 Quick Reference: File Map

```
src/
├── app/
│   ├── globals.css          # CSS variables, dark theme, sliders, animations
│   ├── layout.tsx           # Root layout, metadata, theme class
│   └── page.tsx             # Main page (~300 lines 🚧 needs splitting)
├── components/
│   ├── CategoryPanel.tsx    # Expandable category with params
│   ├── ConfigDiff.tsx       # 🆕 Side-by-side config comparison
│   ├── ConfigEditor.tsx     # Main editor — lens tabs + categories
│   ├── ConfigImporter.tsx   # Upload/paste XML import modal
│   ├── DeviceSelect.tsx     # 🆕 Searchable device dropdown
│   ├── ErrorBoundary.tsx    # 🆕 React error boundary
│   ├── LensTabs.tsx         # Camera lens tab selector
│   ├── ParamControl.tsx     # Renders toggle/slider/select/input
│   ├── PresetSelector.tsx   # Preset picker modal (🚧 needs device filter)
│   ├── SavedConfigsPanel.tsx# 🆕 Extracted from page.tsx
│   ├── ThemeToggle.tsx      # 🆕 Dark/light/system toggle
│   └── TopBar.tsx           # Header: logo, actions, config name, selectors
├── lib/
│   ├── devices.ts           # 23 devices database
│   ├── diff.ts              # 🆕 Config diff computation
│   ├── generator.ts         # UserConfig → XML generator
│   ├── parser.ts            # XML → UserConfig parser
│   ├── presets.ts           # Preset templates (🚧 needs more devices)
│   ├── share.ts             # 🆕 URL encode/decode for sharing
│   ├── store.ts             # localStorage read/write
│   ├── utils.ts             # generateId()
│   ├── hooks/
│   │   ├── useDebouncedSave.ts  # 🆕 Extracted from page.tsx
│   │   └── useKeyboardShortcuts.ts # 🆕 Centralized shortcuts
│   └── schemas/
│       ├── index.ts         # Schema registry
│       ├── bsg.ts           # BSG MGC port params
│       ├── lmc.ts           # LMC 8.4 port params
│       ├── arnova.ts        # Arnova8G2 port params
│       └── agc.ts           # AGC Toolkit port params
└── types/
    └── index.ts             # All TypeScript type definitions
```

---

*Generated by xml-gcamcon planning session. Last updated: July 2026.*
