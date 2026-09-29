// ============================================================
// xml-gcamcon — Preset Templates
// Ready-to-use config presets for Mi A1 (Tissot)
// Optimized for SD625 — conservative values to avoid lag/crash
// ============================================================

import type { PresetTemplate } from "@/types";
import { createDefaultConfig, updateConfigParam } from "./generator";

/**
 * Generate all preset configs for the Mi A1 Tissot.
 * Based on community research: Wyroczen GCam 6.1 / BSG 6.x-7.x
 * SD625 can't handle high HDR frames or aggressive Sabre processing.
 */
export function generateMiA1Presets(): PresetTemplate[] {
  // ---- BSG 6.1 Natural / Daily (Recommended) ----
  const bsgNatural = createDefaultConfig("bsg", "tissot", "BSG Natural Daily — Mi A1");
  const bsgNaturalUpdated = applyUpdates(bsgNatural, [
    // LibPatcher — conservative for SD625
    { key: "lib_sharpness", value: 1.25, cameraId: 0 },
    { key: "lib_spatial_denoise", value: 0.9, cameraId: 0 },
    { key: "lib_chroma_denoise", value: 1.0, cameraId: 0 },
    { key: "lib_luma_denoise", value: 1.0, cameraId: 0 },
    { key: "lib_saturation", value: 1.05, cameraId: 0 },
    { key: "lib_contrast", value: 1.0, cameraId: 0 },
    // AWB — Pixel 3 is best for Mi A1 OV12A10 sensor
    { key: "awb_enabled", value: true },
    { key: "awb_model", value: "pixel3" },
    // HDR — max 9 frames on SD625, 15+ causes shutter lag
    { key: "hdr_frames", value: "7" },
    // Sabre OFF — causes pink artifacts & lag on OV12A10
    { key: "sabre_enabled", value: false },
    // JPEG 97% good balance
    { key: "pref_qjpg_key", value: "97" },
  ]);

  // ---- BSG 6.1 Night / Low Light ----
  const bsgNight = createDefaultConfig("bsg", "tissot", "BSG Night Mode — Mi A1");
  const bsgNightUpdated = applyUpdates(bsgNight, [
    { key: "lib_sharpness", value: 0.9, cameraId: 0 },
    { key: "lib_spatial_denoise", value: 0.7, cameraId: 0 },
    { key: "lib_chroma_denoise", value: 2.5, cameraId: 0 },
    { key: "lib_luma_denoise", value: 2.0, cameraId: 0 },
    { key: "lib_temporal_radius", value: 2.0, cameraId: 0 },
    { key: "under_exposure", value: 1.5 },
    { key: "exposure_darker1", value: 2.0 },
    { key: "awb_enabled", value: true },
    { key: "awb_model", value: "pixel3" },
    { key: "hdr_frames", value: "7" },
    { key: "sabre_enabled", value: false },
  ]);

  // ---- BSG 6.1 Vivid / Colorful ----
  const bsgVivid = createDefaultConfig("bsg", "tissot", "BSG Vivid Colors — Mi A1");
  const bsgVividUpdated = applyUpdates(bsgVivid, [
    { key: "lib_sharpness", value: 1.5, cameraId: 0 },
    { key: "lib_saturation", value: 1.25, cameraId: 0 },
    { key: "lib_saturation2", value: 1.15, cameraId: 0 },
    { key: "lib_contrast2", value: 1.2, cameraId: 0 },
    { key: "lib_chroma_denoise", value: 1.0, cameraId: 0 },
    { key: "awb_enabled", value: true },
    { key: "awb_model", value: "pixel4xl" },
    { key: "hdr_frames", value: "7" },
    { key: "sabre_enabled", value: false },
    { key: "pref_qjpg_key", value: "97" },
  ]);

  // ---- LMC Natural (for those on LMC 8.4 + custom ROM) ----
  const lmcNatural = createDefaultConfig("lmc", "tissot", "LMC Natural — Mi A1");
  const lmcNaturalUpdated = applyUpdates(lmcNatural, [
    { key: "lib_sharpnessb_key", value: 1.2, cameraId: 0 },
    { key: "lib_denoise_luma2_key", value: 3.0, cameraId: 0 },
    { key: "lib_chromadenoise_key", value: 1.0, cameraId: 0 },
    { key: "lib_saturation_key", value: 1.05, cameraId: 0 },
    { key: "pref_awb_key", value: true },
    { key: "pref_hdr_plus_frames_key", value: "7" },
    { key: "pref_qjpg_key", value: "97" },
    { key: "pref_sabre_key", value: false },
  ]);

  // ---- LMC Night ----
  const lmcNight = createDefaultConfig("lmc", "tissot", "LMC Night Mode — Mi A1");
  const lmcNightUpdated = applyUpdates(lmcNight, [
    { key: "lib_sharpnessb_key", value: 0.9, cameraId: 0 },
    { key: "lib_denoise_luma2_key", value: 4.0, cameraId: 0 },
    { key: "lib_chromadenoise_key", value: 2.5, cameraId: 0 },
    { key: "lib_temporal_radius_key", value: 2.0, cameraId: 0 },
    { key: "pref_under_exposure_key", value: 1.5 },
    { key: "pref_exposure_darker_key", value: 2.0 },
    { key: "pref_awb_key", value: true },
    { key: "pref_hdr_plus_frames_key", value: "7" },
    { key: "pref_sabre_key", value: false },
  ]);

  return [
    {
      id: "preset-bsg-natural",
      name: "BSG 6.1 Natural Daily ⭐",
      description: "Recommended daily config for Mi A1. Conservative sharpness, Pixel 3 AWB (fixes green tint), 7 HDR frames for no lag. Tested on Wyroczen & BSG 6.1 ports.",
      portId: "bsg",
      deviceCodename: "tissot",
      author: "xml-gcamcon",
      tags: ["natural", "daily", "balanced", "recommended"],
      config: bsgNaturalUpdated,
    },
    {
      id: "preset-bsg-night",
      name: "BSG 6.1 Night Mode 🌙",
      description: "Low-light optimized. Stronger chroma denoise (2.5), darker exposure to preserve highlights, 9 HDR frames. Enable Night Sight in GCam for best results.",
      portId: "bsg",
      deviceCodename: "tissot",
      author: "xml-gcamcon",
      tags: ["night", "low-light", "dark"],
      config: bsgNightUpdated,
    },
    {
      id: "preset-bsg-vivid",
      name: "BSG 6.1 Vivid Colors 🎨",
      description: "Boosted saturation for punchy social-media-ready photos. Pixel 4XL AWB for warmer tones. Great for outdoor & landscapes.",
      portId: "bsg",
      deviceCodename: "tissot",
      author: "xml-gcamcon",
      tags: ["vivid", "colorful", "punchy", "outdoor"],
      config: bsgVividUpdated,
    },
    {
      id: "preset-lmc-natural",
      name: "LMC 8.4 Natural",
      description: "For custom ROM users running LMC 8.4. Conservative LibPatcher settings, Sabre off, 7 HDR frames. Only use if BSG 6.1 is unstable on your ROM.",
      portId: "lmc",
      deviceCodename: "tissot",
      author: "xml-gcamcon",
      tags: ["natural", "daily", "lmc", "custom-rom"],
      config: lmcNaturalUpdated,
    },
    {
      id: "preset-lmc-night",
      name: "LMC 8.4 Night Mode 🌙",
      description: "Night config for LMC 8.4 on custom ROMs. Strong NR with dark exposure. Works best with Night Sight mode enabled.",
      portId: "lmc",
      deviceCodename: "tissot",
      author: "xml-gcamcon",
      tags: ["night", "low-light", "lmc", "custom-rom"],
      config: lmcNightUpdated,
    },
  ];
}

function applyUpdates(
  config: ReturnType<typeof createDefaultConfig>,
  updates: { key: string; value: number | boolean | string; cameraId?: number }[]
) {
  let updated = config;
  for (const update of updates) {
    updated = updateConfigParam(updated, update.key, update.value, update.cameraId);
  }
  return updated;
}

export const miA1Presets = generateMiA1Presets();

// ============================================================
// Redmi Note 10 Pro (sweet) — 108MP HM2, SD732G
// SD732G handles higher HDR frames and Sabre well
// ============================================================

export function generateSweetPresets(): PresetTemplate[] {
  // BSG Natural
  const bsgNatural = createDefaultConfig("bsg", "sweet", "RN10 Pro Natural — BSG");
  const bsgNaturalUpdated = applyUpdates(bsgNatural, [
    { key: "lib_sharpness", value: 1.3, cameraId: 0 },
    { key: "lib_spatial_denoise", value: 0.9, cameraId: 0 },
    { key: "lib_chroma_denoise", value: 1.0, cameraId: 0 },
    { key: "lib_luma_denoise", value: 1.0, cameraId: 0 },
    { key: "lib_saturation", value: 1.05, cameraId: 0 },
    { key: "lib_contrast", value: 1.0, cameraId: 0 },
    { key: "awb_enabled", value: true },
    { key: "awb_model", value: "pixel6pro" },
    { key: "hdr_frames", value: "15" },
    { key: "sabre_enabled", value: true },
    { key: "pref_qjpg_key", value: "97" },
  ]);

  // BSG Night
  const bsgNight = createDefaultConfig("bsg", "sweet", "RN10 Pro Night — BSG");
  const bsgNightUpdated = applyUpdates(bsgNight, [
    { key: "lib_sharpness", value: 1.0, cameraId: 0 },
    { key: "lib_spatial_denoise", value: 0.7, cameraId: 0 },
    { key: "lib_chroma_denoise", value: 2.0, cameraId: 0 },
    { key: "lib_luma_denoise", value: 1.5, cameraId: 0 },
    { key: "lib_temporal_radius", value: 2.0, cameraId: 0 },
    { key: "under_exposure", value: 1.3 },
    { key: "exposure_darker1", value: 1.8 },
    { key: "awb_enabled", value: true },
    { key: "awb_model", value: "pixel6pro" },
    { key: "hdr_frames", value: "15" },
    { key: "sabre_enabled", value: true },
  ]);

  // BSG Vivid
  const bsgVivid = createDefaultConfig("bsg", "sweet", "RN10 Pro Vivid — BSG");
  const bsgVividUpdated = applyUpdates(bsgVivid, [
    { key: "lib_sharpness", value: 1.5, cameraId: 0 },
    { key: "lib_saturation", value: 1.25, cameraId: 0 },
    { key: "lib_saturation2", value: 1.15, cameraId: 0 },
    { key: "lib_contrast2", value: 1.2, cameraId: 0 },
    { key: "awb_enabled", value: true },
    { key: "awb_model", value: "pixel7pro" },
    { key: "hdr_frames", value: "15" },
    { key: "sabre_enabled", value: true },
    { key: "pref_qjpg_key", value: "97" },
  ]);

  return [
    {
      id: "preset-sweet-bsg-natural",
      name: "RN10 Pro Natural Daily ⭐",
      description: "Recommended daily for Redmi Note 10 Pro. Pixel 6 Pro AWB for accurate colors, 15 HDR frames (SD732G handles fine), Sabre on for super-res detail. 108MP HM2 optimized.",
      portId: "bsg",
      deviceCodename: "sweet",
      author: "xml-gcamcon",
      tags: ["natural", "daily", "recommended"],
      config: bsgNaturalUpdated,
    },
    {
      id: "preset-sweet-bsg-night",
      name: "RN10 Pro Night Mode 🌙",
      description: "Low-light config for RN10 Pro. Aggressive chroma denoise for 108MP sensor, darker exposure control, Sabre ON (SD732G can handle). Works great with Night Sight.",
      portId: "bsg",
      deviceCodename: "sweet",
      author: "xml-gcamcon",
      tags: ["night", "low-light"],
      config: bsgNightUpdated,
    },
    {
      id: "preset-sweet-bsg-vivid",
      name: "RN10 Pro Vivid Colors 🎨",
      description: "Punchy colors for social media. Boosted saturation + Pixel 7 Pro AWB for warm tones. Great for outdoor daylight & landscapes.",
      portId: "bsg",
      deviceCodename: "sweet",
      author: "xml-gcamcon",
      tags: ["vivid", "colorful", "outdoor"],
      config: bsgVividUpdated,
    },
  ];
}

export const sweetPresets = generateSweetPresets();

// ============================================================
// POCO X3 NFC (surya) — 64MP IMX682, SD732G
// ============================================================

export function generateSuryaPresets(): PresetTemplate[] {
  // BSG Natural
  const bsgNatural = createDefaultConfig("bsg", "surya", "POCO X3 NFC Natural — BSG");
  const bsgNaturalUpdated = applyUpdates(bsgNatural, [
    { key: "lib_sharpness", value: 1.25, cameraId: 0 },
    { key: "lib_spatial_denoise", value: 0.9, cameraId: 0 },
    { key: "lib_chroma_denoise", value: 1.0, cameraId: 0 },
    { key: "lib_saturation", value: 1.0, cameraId: 0 },
    { key: "awb_enabled", value: true },
    { key: "awb_model", value: "pixel6pro" },
    { key: "hdr_frames", value: "15" },
    { key: "sabre_enabled", value: true },
    { key: "pref_qjpg_key", value: "97" },
  ]);

  // BSG Night
  const bsgNight = createDefaultConfig("bsg", "surya", "POCO X3 NFC Night — BSG");
  const bsgNightUpdated = applyUpdates(bsgNight, [
    { key: "lib_sharpness", value: 1.0, cameraId: 0 },
    { key: "lib_spatial_denoise", value: 0.7, cameraId: 0 },
    { key: "lib_chroma_denoise", value: 2.0, cameraId: 0 },
    { key: "lib_luma_denoise", value: 1.5, cameraId: 0 },
    { key: "lib_temporal_radius", value: 2.0, cameraId: 0 },
    { key: "under_exposure", value: 1.3 },
    { key: "exposure_darker1", value: 1.8 },
    { key: "awb_enabled", value: true },
    { key: "awb_model", value: "pixel6pro" },
    { key: "hdr_frames", value: "15" },
    { key: "sabre_enabled", value: true },
  ]);

  return [
    {
      id: "preset-surya-bsg-natural",
      name: "POCO X3 NFC Natural Daily ⭐",
      description: "Recommended daily for POCO X3 NFC. IMX682 64MP sensor with Pixel 6 Pro AWB for natural colors. 15 HDR frames, Sabre ON (SD732G handles fine).",
      portId: "bsg",
      deviceCodename: "surya",
      author: "xml-gcamcon",
      tags: ["natural", "daily", "recommended"],
      config: bsgNaturalUpdated,
    },
    {
      id: "preset-surya-bsg-night",
      name: "POCO X3 NFC Night Mode 🌙",
      description: "Low-light for POCO X3 NFC. IMX682 has good light sensitivity — chroma denoise at 2.0, dark exposure for highlight preservation.",
      portId: "bsg",
      deviceCodename: "surya",
      author: "xml-gcamcon",
      tags: ["night", "low-light"],
      config: bsgNightUpdated,
    },
  ];
}

export const suryaPresets = generateSuryaPresets();

// --- All presets combined ---

export const allPresets: PresetTemplate[] = [
  ...miA1Presets,
  ...sweetPresets,
  ...suryaPresets,
];
