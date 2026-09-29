// ============================================================
// xml-gcamcon — XML Parser
// Parses GCam XML config strings → typed UserConfig objects
// ============================================================

import type { ParamValue, ParamType, UserConfig, GcamPortId, CameraId } from "@/types";
import { generateId } from "./utils";

interface ParsedParam {
  key: string;
  value: string | number | boolean;
  type: "string" | "int" | "long" | "float" | "boolean" | "set";
}

/**
 * Parse a GCam config XML string into structured data.
 */
export function parseConfigXml(
  xml: string,
  portId: GcamPortId,
  deviceCodename: string,
  name?: string
): UserConfig {
  const params = parseXmlToParams(xml);
  const globalParams: ParamValue[] = [];
  const lensConfigs = new Map<CameraId, ParamValue[]>();

  for (const param of params) {
    const typedValue = mapParamValue(param);
    const cameraId = extractCameraId(param.key);

    if (cameraId !== null) {
      if (!lensConfigs.has(cameraId)) lensConfigs.set(cameraId, []);
      lensConfigs.get(cameraId)!.push(typedValue);
    } else {
      globalParams.push(typedValue);
    }
  }

  const now = new Date().toISOString();

  return {
    id: generateId(),
    name: name || "Imported Config",
    portId,
    deviceCodename,
    globalParams,
    lensConfigs: Array.from(lensConfigs.entries()).map(([cameraId, params]) => ({
      cameraId,
      params,
    })),
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Parse raw XML into a list of typed parameters.
 */
function parseXmlToParams(xml: string): ParsedParam[] {
  const results: ParsedParam[] = [];

  // Match <string name="key">value</string>
  const stringRegex = /<string\s+name="([^"]+)"\s*>\s*([^<]*?)\s*<\/string>/g;
  let match: RegExpExecArray | null;
  while ((match = stringRegex.exec(xml)) !== null) {
    results.push({ key: match[1], value: match[2], type: "string" });
  }

  // Match <boolean name="key" value="true/false" />
  const boolRegex = /<boolean\s+name="([^"]+)"\s+value="(true|false)"\s*\/>/g;
  while ((match = boolRegex.exec(xml)) !== null) {
    results.push({ key: match[1], value: match[2] === "true", type: "boolean" });
  }

  // Match <int name="key" value="123" />
  const intRegex = /<int\s+name="([^"]+)"\s+value="(\d+)"\s*\/>/g;
  while ((match = intRegex.exec(xml)) !== null) {
    results.push({ key: match[1], value: parseInt(match[2], 10), type: "int" });
  }

  // Match <long name="key" value="123" />
  const longRegex = /<long\s+name="([^"]+)"\s+value="(\d+)"\s*\/>/g;
  while ((match = longRegex.exec(xml)) !== null) {
    results.push({ key: match[1], value: parseInt(match[2], 10), type: "long" });
  }

  // Match <float name="key" value="1.5" />
  const floatRegex = /<float\s+name="([^"]+)"\s+value="([\d.]+)"\s*\/>/g;
  while ((match = floatRegex.exec(xml)) !== null) {
    results.push({ key: match[1], value: parseFloat(match[2]), type: "float" });
  }

  return results;
}

/**
 * Map a raw parsed param to the unified ParamValue type.
 */
function mapParamValue(param: ParsedParam): ParamValue {
  const typeMap: Record<string, ParamType> = {
    string: "string",
    int: "int",
    long: "int",
    float: "float",
    boolean: "boolean",
  };

  return {
    key: param.key,
    value: param.value,
    type: typeMap[param.type] || "string",
  };
}

/**
 * Try to extract camera/lens ID from the key name.
 * Many GCam ports use suffixes like _key_0, _key_1, etc. for per-lens.
 */
function extractCameraId(key: string): CameraId | null {
  // Match patterns like: ..._0_key, ..._1_key, ..._2nd_key, ..._3rd_key (per-lens suffixes)
  const suffixMatch = key.match(/_(\d)(?:st|nd|rd|th)?_key$/);
  if (suffixMatch) {
    const id = parseInt(suffixMatch[1], 10);
    if (id >= 0 && id <= 4) return id as CameraId;
  }

  // Match specific lens prefixes/suffixes in key names
  if (key.startsWith("main_") || key.includes("_main_")) return 0;
  if (key.startsWith("front_") || key.includes("_front_") || key.includes("_selfie_")) return 1;
  if (key.startsWith("tele_") || key.includes("_tele_")) return 2;
  if (key.startsWith("uw_") || key.includes("_uw_") || key.includes("_ultrawide_")) return 3;

  return null;
}
