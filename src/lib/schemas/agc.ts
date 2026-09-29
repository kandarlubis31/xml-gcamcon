// ============================================================
// xml-gcamcon — AGC (BigKaka) Port Schema
// ============================================================

import type { GcamPortSchema, CameraId } from "@/types";

const lenses: CameraId[] = [0, 1, 2, 3];

export const agcSchema: GcamPortSchema = {
  meta: {
    id: "agc",
    name: "AGC Toolkit",
    developer: "BigKaka",
    configFolder: "/Download/AGC.9.2/configs/",
    loadGesture: "Load from settings → Load Configs",
    description: "AGC (Advanced GCam) by BigKaka features modern UI, extensive manual controls, LUT support, and watermarks. Uses .agc config format (XML-based).",
    recommendedVersion: "AGC 9.2",
    website: "https://www.celsoazevedo.com/files/android/google-camera/dev-BigKaka/",
  },
  supportedLenses: lenses,
  categories: [
    {
      id: "libpatcher",
      label: "Lib Patcher",
      icon: "🔧",
      perLens: true,
      params: [
        { key: "lib_pref_sharpness_key", label: "Sharpness", type: "float", defaultValue: 1.0, min: 0.0, max: 3.0, step: 0.1, description: "Higher = sharper image" },
        { key: "lib_pref_luma_denoise_key", label: "Luma Denoise", type: "float", defaultValue: 1.5, min: 0.0, max: 5.0, step: 0.1, description: "Luminance noise reduction" },
        { key: "lib_pref_chroma_denoise_key", label: "Chroma Denoise", type: "float", defaultValue: 1.0, min: 0.0, max: 10.0, step: 0.1, description: "Color noise reduction" },
        { key: "lib_gpu_saturation_key", label: "GPU Saturation", type: "float", defaultValue: 1.0, min: 0.5, max: 2.5, step: 0.05, description: "GPU-based saturation control" },
        { key: "lib_pref_contrast_key", label: "Contrast", type: "float", defaultValue: 1.0, min: 0.5, max: 2.0, step: 0.1, description: "Global contrast" },
        { key: "lib_pref_temporal_radius_key", label: "Temporal Radius", type: "float", defaultValue: 2.0, min: 0.0, max: 5.0, step: 0.5, description: "Temporal noise reduction strength" },
        { key: "lib_pref_saturation_key", label: "Saturation", type: "float", defaultValue: 1.0, min: 0.5, max: 2.5, step: 0.05, description: "Color saturation" },
        { key: "lib_pref_brightness_key", label: "Brightness", type: "float", defaultValue: 1.0, min: 0.5, max: 2.0, step: 0.05, description: "Brightness control" },
      ],
    },
    {
      id: "exposure",
      label: "Exposure & HDR",
      icon: "☀️",
      perLens: false,
      params: [
        { key: "pref_exposure_key", label: "Exposure Compensation", type: "float", defaultValue: 0.0, min: -2.0, max: 2.0, step: 0.1, description: "Global exposure offset" },
        { key: "pref_hdr_plus_frames_key", label: "HDR+ Frames", type: "select", defaultValue: "15", options: [
          { label: "7 frames (fast)", value: "7" },
          { label: "15 frames (balanced)", value: "15" },
          { label: "21 frames (quality)", value: "21" },
          { label: "30 frames (max)", value: "30" },
        ], description: "Number of HDR merge frames" },
      ],
    },
    {
      id: "awb",
      label: "AWB & Color",
      icon: "🎨",
      perLens: true,
      params: [
        { key: "pref_awb_key", label: "Google AWB", type: "boolean", defaultValue: true, description: "Auto White Balance" },
        { key: "lib_pref_green_coeff_key", label: "Green Coeff", type: "float", defaultValue: 1.0, min: 0.0, max: 2.0, step: 0.01, description: "Green channel", advanced: true },
        { key: "lib_pref_red_coeff_key", label: "Red Coeff", type: "float", defaultValue: 1.0, min: 0.0, max: 2.0, step: 0.01, description: "Red channel", advanced: true },
        { key: "lib_pref_blue_coeff_key", label: "Blue Coeff", type: "float", defaultValue: 1.0, min: 0.0, max: 2.0, step: 0.01, description: "Blue channel", advanced: true },
        { key: "br_key", label: "Black Reference", type: "float", defaultValue: 0.093, min: -1.0, max: 1.0, step: 0.001, description: "Black level reference", advanced: true },
        { key: "rg_key", label: "Red-Green Ratio", type: "float", defaultValue: -0.937, min: -2.0, max: 2.0, step: 0.001, description: "Red-Green ratio for color balance", advanced: true },
      ],
    },
    {
      id: "preferences",
      label: "General Settings",
      icon: "⚙️",
      perLens: false,
      params: [
        { key: "pref_qjpg_key", label: "JPEG Quality", type: "select", defaultValue: "97", options: [
          { label: "100%", value: "100" },
          { label: "97%", value: "97" },
          { label: "95%", value: "95" },
          { label: "90%", value: "90" },
        ], description: "Output JPEG quality" },
        { key: "pref_camera_selfie_mirror_key", label: "Selfie Mirror", type: "boolean", defaultValue: true, description: "Mirror front camera" },
        { key: "hdrnet_enabled", label: "HDRNet", type: "boolean", defaultValue: false, description: "Real-time HDR preview" },
        { key: "pref_video_4k_key", label: "4K Video", type: "boolean", defaultValue: true, description: "Enable 4K recording" },
      ],
    },
  ],
};
