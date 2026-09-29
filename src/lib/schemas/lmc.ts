// ============================================================
// xml-gcamcon — LMC (Hasli) Port Schema
// ============================================================

import type { GcamPortSchema, CameraId } from "@/types";

const lenses: CameraId[] = [0, 1, 2, 3];

export const lmcSchema: GcamPortSchema = {
  meta: {
    id: "lmc",
    name: "LMC (Hasli)",
    developer: "Hasli",
    configFolder: "/LMC8.4/",
    loadGesture: "Double-tap near shutter",
    description: "LMC is known for extensive LibPatcher features and excellent compatibility within the same version family. Highly customizable with per-lens settings.",
    recommendedVersion: "LMC 8.4 R18",
    website: "https://www.celsoazevedo.com/files/android/google-camera/dev-hasli/",
  },
  supportedLenses: lenses,
  categories: [
    {
      id: "libpatcher",
      label: "Lib Patcher",
      icon: "🔧",
      perLens: true,
      params: [
        { key: "lib_sharpnessb_key", label: "Sharpness B", type: "float", defaultValue: 1.2, min: 0.0, max: 3.0, step: 0.1, description: "Sharpness variant B — higher = sharper" },
        { key: "lib_sharpness_key", label: "Sharpness", type: "float", defaultValue: 1.0, min: 0.0, max: 3.0, step: 0.1, description: "Main sharpness control" },
        { key: "lib_denoise_luma2_key", label: "Denoise Luma 2", type: "float", defaultValue: 3.5, min: 0.0, max: 6.0, step: 0.1, description: "Luminance noise reduction. Higher = cleaner but more smudge" },
        { key: "lib_chromadenoise_key", label: "Chroma Denoise", type: "float", defaultValue: 1.0, min: 0.0, max: 10.0, step: 0.1, description: "Color noise reduction" },
        { key: "lib_saturation_key", label: "Saturation", type: "float", defaultValue: 1.0, min: 0.5, max: 2.5, step: 0.05, description: "Color saturation" },
        { key: "lib_contrast_key", label: "Contrast", type: "float", defaultValue: 1.0, min: 0.5, max: 2.0, step: 0.1, description: "Global contrast" },
        { key: "lib_temporal_radius_key", label: "Temporal Radius", type: "float", defaultValue: 2.0, min: 0.0, max: 5.0, step: 0.5, description: "Most powerful noise reduction tool" },
        { key: "lib_smoothness_key", label: "Smoothness", type: "float", defaultValue: 1.0, min: 0.0, max: 3.0, step: 0.1, description: "Controls smoothness. Higher = less sharpening structure" },
        { key: "lib_clarity_key", label: "Clarity", type: "float", defaultValue: 1.0, min: 0.0, max: 3.0, step: 0.1, description: "Mid-tone clarity control" },
        { key: "lib_brightness_key", label: "Brightness", type: "float", defaultValue: 1.0, min: 0.5, max: 2.0, step: 0.05, description: "Highlight control" },
        { key: "lib_noise_reduction_key", label: "Noise Reduction", type: "float", defaultValue: 1.0, min: 0.0, max: 3.0, step: 0.1, description: "Higher = more noise but more sharpness", advanced: true },
        { key: "lib_saturation2_key", label: "Saturation 2", type: "float", defaultValue: 1.0, min: 0.5, max: 2.5, step: 0.05, description: "Global color vibrancy", advanced: true },
      ],
    },
    {
      id: "exposure",
      label: "Exposure & HDR",
      icon: "☀️",
      perLens: false,
      params: [
        { key: "pref_exposure_5th_key", label: "HDR Up", type: "float", defaultValue: 1.0, min: 0.0, max: 3.0, step: 0.1, description: "Higher = darker image" },
        { key: "pref_under_exposure_key", label: "Under Exposure", type: "float", defaultValue: 1.0, min: 0.5, max: 4.0, step: 0.1, description: "Higher = darker, preserves shadows" },
        { key: "pref_exposure_darker_key", label: "Exposure Darker", type: "float", defaultValue: 1.0, min: 0.5, max: 4.0, step: 0.1, description: "Dramatically reduces highlights" },
        { key: "pref_hdr_plus_frames_key", label: "HDR+ Frames", type: "select", defaultValue: "15", options: [
          { label: "7 frames (faster)", value: "7" },
          { label: "15 frames (balanced)", value: "15" },
          { label: "21 frames (quality)", value: "21" },
          { label: "30 frames (max)", value: "30" },
        ], description: "Number of exposures for HDR merge" },
      ],
    },
    {
      id: "awb",
      label: "AWB & Color",
      icon: "🎨",
      perLens: true,
      params: [
        { key: "pref_awb_key", label: "Google AWB", type: "boolean", defaultValue: true, description: "Google Auto White Balance" },
        { key: "cw_rg_key_2", label: "Color RG (Lens 2)", type: "float", defaultValue: 0.5925, min: -2.0, max: 2.0, step: 0.0001, description: "Red-Green color weight for lens 2 (tele)", advanced: true },
        { key: "gr_5_key", label: "GR Channel 5", type: "float", defaultValue: -0.148, min: -2.0, max: 2.0, step: 0.001, description: "Green-Red channel fine-tune", advanced: true },
        { key: "lib_green_coeff_key", label: "Green Coefficient", type: "float", defaultValue: 1.0, min: 0.0, max: 2.0, step: 0.01, description: "Green channel fine-tune", advanced: true },
        { key: "lib_red_coeff_key", label: "Red Coefficient", type: "float", defaultValue: 1.0, min: 0.0, max: 2.0, step: 0.01, description: "Red channel fine-tune", advanced: true },
        { key: "lib_blue_coeff_key", label: "Blue Coefficient", type: "float", defaultValue: 1.0, min: 0.0, max: 2.0, step: 0.01, description: "Blue channel fine-tune", advanced: true },
      ],
    },
    {
      id: "sabre",
      label: "Sabre Merge",
      icon: "🔍",
      perLens: false,
      params: [
        { key: "pref_sabre_key", label: "Sabre Enabled", type: "boolean", defaultValue: true, description: "Super Resolution merge algorithm" },
        { key: "lib_sabre1_key", label: "Sabre 1", type: "float", defaultValue: 1.0, min: 0.0, max: 3.0, step: 0.1, description: "Sabre sharpness parameter 1" },
        { key: "lib_sabre2_key", label: "Sabre 2", type: "float", defaultValue: 1.0, min: 0.0, max: 3.0, step: 0.1, description: "Sabre sharpness parameter 2" },
        { key: "lib_lumadmsabre_l4b_key", label: "Luma DMSABRE", type: "float", defaultValue: 1.0, min: 0.0, max: 3.0, step: 0.1, description: "Sabre luma demosaicing", advanced: true },
      ],
    },
    {
      id: "preferences",
      label: "General Settings",
      icon: "⚙️",
      perLens: false,
      params: [
        { key: "pref_qjpg_key", label: "JPEG Quality", type: "select", defaultValue: "97", options: [
          { label: "100% (best)", value: "100" },
          { label: "97% (recommended)", value: "97" },
          { label: "95%", value: "95" },
          { label: "90%", value: "90" },
        ], description: "Output JPEG quality" },
        { key: "pref_camera_selfie_mirror_key", label: "Selfie Mirror", type: "boolean", defaultValue: true, description: "Mirror front camera preview" },
        { key: "pref_max_focus_value_key", label: "Max Focus Value", type: "string", defaultValue: "12", description: "Maximum focus slider value" },
        { key: "pref_iso_noise_coeff_key", label: "ISO Noise Coeff", type: "float", defaultValue: 0.5, min: 0.0, max: 2.0, step: 0.05, description: "ISO-based noise coefficient", advanced: true },
        { key: "camera_mts_4k", label: "4K Video", type: "boolean", defaultValue: true, description: "Enable 4K video recording" },
      ],
    },
  ],
};
