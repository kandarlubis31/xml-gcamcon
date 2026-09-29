// ============================================================
// xml-gcamcon — GCam Config Maker
// Core Type Definitions
// ============================================================

// --- Device & Camera Hardware ---

export interface CameraSensor {
  id: number;           // Camera ID used in GCam (0 = main, 1 = front, 2 = tele, 3 = ultrawide)
  name: string;         // "Main Wide", "Telephoto", "Front"
  megapixels: number;
  aperture: string;     // "f/2.2"
  sensorModel: string;  // "OmniVision OV12A10"
  pixelSize: string;    // "1.25µm"
  hasOIS: boolean;
  hasAF: boolean;
}

export interface Device {
  codename: string;        // "tissot"
  brand: string;           // "Xiaomi"
  model: string;           // "Mi A1"
  chipset: string;         // "Snapdragon 625"
  androidVersion: string;  // "9.0 (Pie)"
  camera2ApiLevel: "Legacy" | "Limited" | "Full" | "Level3";
  sensors: CameraSensor[];
  notes?: string;
}

// --- GCam Port ---

export type GcamPortId = "bsg" | "lmc" | "arnova" | "agc";

export interface GcamPortMeta {
  id: GcamPortId;
  name: string;                 // "BSG MGC"
  developer: string;            // "BSG"
  configFolder: string;         // "/GCam/Configs/"
  loadGesture: string;           // "Double-tap near shutter"
  description: string;
  recommendedVersion: string;   // "MGC 8.4"
  website?: string;
}

// --- XML Config Parameter Definitions ---

export type ParamType = "float" | "int" | "boolean" | "string" | "select" | "colorMatrix";

export interface ParamOption {
  label: string;
  value: string | number | boolean;
}

export interface ParamDefinition {
  key: string;                  // XML tag name (e.g., "lib_sharpness")
  label: string;                // Human-readable name
  type: ParamType;
  defaultValue: number | boolean | string;
  min?: number;                 // Only for float/int
  max?: number;                 // Only for float/int
  step?: number;                // Only for float/int
  options?: ParamOption[];      // Only for select type
  description?: string;
  unit?: string;                // e.g., "frames", "px", "%"
  advanced?: boolean;           // Hidden behind "Advanced" toggle
}

export type CameraId = 0 | 1 | 2 | 3 | 4;

export interface ParamCategory {
  id: string;                   // e.g., "libpatcher", "exposure", "awb"
  label: string;                // "Lib Patcher", "Exposure & HDR"
  icon?: string;                // Emoji or icon name
  perLens: boolean;             // Does this category have per-lens settings?
  params: ParamDefinition[];
}

export interface GcamPortSchema {
  meta: GcamPortMeta;
  categories: ParamCategory[];
  supportedLenses: CameraId[];  // Which camera IDs this port supports per-lens configs for
}

// --- User Config ---

export interface ParamValue {
  key: string;
  value: number | boolean | string;
  type: ParamType;
}

export interface LensConfig {
  cameraId: CameraId;
  params: ParamValue[];
}

export interface UserConfig {
  id: string;                     // Unique ID
  name: string;                   // User-given name
  portId: GcamPortId;
  deviceCodename: string;
  globalParams: ParamValue[];
  lensConfigs: LensConfig[];
  createdAt: string;             // ISO date
  updatedAt: string;
}

// --- Preset Template ---

export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  portId: GcamPortId;
  deviceCodename: string;
  author?: string;
  tags: string[];               // e.g., ["night", "vivid", "natural"]
  config: UserConfig;           // The actual config data
}
