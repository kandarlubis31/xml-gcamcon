// ============================================================
// xml-gcamcon — Arnova8G2 Port Schema
// ============================================================

import type { GcamPortSchema, CameraId } from "@/types";

const lenses: CameraId[] = [0, 1, 2];

export const arnovaSchema: GcamPortSchema = {
  meta: {
    id: "arnova",
    name: "Arnova8G2",
    developer: "Arnova8G2",
    configFolder: "/GCam/Configs/",
    loadGesture: "Double-tap near shutter",
    description: "Arnova8G2 was one of the first developers to implement XML config support. Focuses on broad device compatibility. Great for older devices like the Mi A1.",
    recommendedVersion: "GCam 6.1 / 7.x",
    website: "https://www.celsoazevedo.com/files/android/google-camera/dev-arnova8G2/",
  },
  supportedLenses: lenses,
  categories: [
    {
      id: "libpatcher",
      label: "Lib Patcher",
      icon: "🔧",
      perLens: true,
      params: [
        { key: "hdr_sharpness", label: "Sharpness", type: "float", defaultValue: 1.0, min: 0.0, max: 3.0, step: 0.1, description: "Sharpness level" },
        { key: "hdr_noise_reduction", label: "Noise Reduction", type: "float", defaultValue: 1.0, min: 0.0, max: 5.0, step: 0.1, description: "Noise reduction strength" },
        { key: "hdr_saturation", label: "Saturation", type: "float", defaultValue: 1.0, min: 0.5, max: 2.5, step: 0.05, description: "Color saturation" },
        { key: "hdr_contrast", label: "Contrast", type: "float", defaultValue: 1.0, min: 0.5, max: 2.0, step: 0.1, description: "Global contrast" },
        { key: "hdr_brightness", label: "Brightness", type: "float", defaultValue: 1.0, min: 0.5, max: 2.0, step: 0.05, description: "Brightness level" },
      ],
    },
    {
      id: "exposure",
      label: "Exposure & HDR",
      icon: "☀️",
      perLens: false,
      params: [
        { key: "hdr_exposure", label: "HDR Exposure", type: "float", defaultValue: 1.0, min: 0.0, max: 3.0, step: 0.1, description: "HDR exposure blend" },
        { key: "hdr_frames", label: "HDR+ Frames", type: "select", defaultValue: "15", options: [
          { label: "7 frames", value: "7" },
          { label: "15 frames", value: "15" },
          { label: "21 frames", value: "21" },
        ], description: "Number of HDR merge frames" },
      ],
    },
    {
      id: "awb",
      label: "AWB & Color",
      icon: "🎨",
      perLens: true,
      params: [
        { key: "awb_enabled", label: "Google AWB", type: "boolean", defaultValue: true, description: "Auto White Balance" },
        { key: "white_balance_mode", label: "WB Mode", type: "select", defaultValue: "auto", options: [
          { label: "Auto", value: "auto" },
          { label: "Pixel 3", value: "pixel3" },
          { label: "Pixel 4", value: "pixel4" },
          { label: "Pixel 5", value: "pixel5" },
        ], description: "White balance mode" },
      ],
    },
    {
      id: "preferences",
      label: "General Settings",
      icon: "⚙️",
      perLens: false,
      params: [
        { key: "jpeg_quality", label: "JPEG Quality", type: "select", defaultValue: "97", options: [
          { label: "100%", value: "100" },
          { label: "97%", value: "97" },
          { label: "95%", value: "95" },
          { label: "90%", value: "90" },
        ], description: "Output JPEG quality" },
        { key: "selfie_mirror", label: "Selfie Mirror", type: "boolean", defaultValue: true, description: "Mirror front camera" },
        { key: "lib_patcher_enabled", label: "Lib Patcher Enabled", type: "boolean", defaultValue: true, description: "Enable lib patcher tweaks" },
      ],
    },
  ],
};
