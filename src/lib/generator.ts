// ============================================================
// xml-gcamcon — XML Generator
// Generates GCam XML config strings from UserConfig objects
// ============================================================

import type { UserConfig, ParamValue, LensConfig, GcamPortId, ParamDefinition } from "@/types";
import { getPortSchema } from "./schemas";
import { generateId } from "./utils";

/**
 * Generate a valid GCam XML config string from a UserConfig object.
 */
export function generateConfigXml(config: UserConfig): string {
  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="utf-8" standalone="yes" ?>');
  lines.push("<map>");

  // Write global params
  for (const param of config.globalParams) {
    lines.push(formatParam(param, "", config.portId));
  }

  // Write per-lens params
  if (config.lensConfigs.length > 0) {
    for (const lensConfig of config.lensConfigs) {
      const lensComment = getLensName(lensConfig.cameraId);
      lines.push(`    <!-- ${lensComment} -->`);
      for (const param of lensConfig.params) {
        lines.push(formatParam(param, "", config.portId));
      }
    }
  }

  lines.push("</map>");
  return lines.join("\n") + "\n";
}

/**
 * Format a single param value into an XML element string.
 */
function formatParam(param: ParamValue, indent: string, portId: GcamPortId): string {
  const key = param.key;
  const value = param.value;

  switch (param.type) {
    case "string":
      return `${indent}    <string name="${key}">${value}</string>`;
    case "boolean":
      return `${indent}    <boolean name="${key}" value="${value}" />`;
    case "int":
      return `${indent}    <int name="${key}" value="${value}" />`;
    case "float":
      return `${indent}    <float name="${key}" value="${value}" />`;
    default:
      return `${indent}    <string name="${key}">${value}</string>`;
  }
}

/**
 * Build a UserConfig from port schema defaults.
 */
export function createDefaultConfig(
  portId: GcamPortId,
  deviceCodename: string,
  name?: string
): UserConfig {
  const schema = getPortSchema(portId);
  const globalParams: ParamValue[] = [];
  const lensConfigs: LensConfig[] = [];

  for (const category of schema.categories) {
    for (const paramDef of category.params) {
      if (!category.perLens) {
        globalParams.push({
          key: paramDef.key,
          value: paramDef.defaultValue,
          type: paramDef.type,
        });
      }
    }
  }

  // Build per-lens configs
  for (const cameraId of schema.supportedLenses) {
    const lensParams: ParamValue[] = [];
    for (const category of schema.categories) {
      if (category.perLens) {
        for (const paramDef of category.params) {
          lensParams.push({
            key: paramDef.key,
            value: paramDef.defaultValue,
            type: paramDef.type,
          });
        }
      }
    }
    lensConfigs.push({ cameraId, params: lensParams });
  }

  const now = new Date().toISOString();

  return {
    id: generateId(),
    name: name || `${schema.meta.name} Default Config`,
    portId,
    deviceCodename,
    globalParams,
    lensConfigs,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Merge user-edited param values into a config, keeping existing params.
 */
export function updateConfigParam(
  config: UserConfig,
  key: string,
  value: number | boolean | string,
  cameraId?: number
): UserConfig {
  const updated = { ...config, updatedAt: new Date().toISOString() };

  if (cameraId !== undefined && cameraId !== null) {
    // Per-lens param
    updated.lensConfigs = config.lensConfigs.map((lc) => {
      if (lc.cameraId !== cameraId) return lc;
      const existingIdx = lc.params.findIndex((p) => p.key === key);
      if (existingIdx >= 0) {
        const newParams = [...lc.params];
        newParams[existingIdx] = { ...newParams[existingIdx], value };
        return { ...lc, params: newParams };
      }
      // Add new param to this lens
      return {
        ...lc,
        params: [...lc.params, { key, value, type: typeof value === "boolean" ? "boolean" : typeof value === "number" ? "float" : "string" }],
      };
    });
  } else {
    // Global param
    const existingIdx = updated.globalParams.findIndex((p) => p.key === key);
    if (existingIdx >= 0) {
      updated.globalParams = [...updated.globalParams];
      updated.globalParams[existingIdx] = { ...updated.globalParams[existingIdx], value };
    } else {
      updated.globalParams = [
        ...updated.globalParams,
        { key, value, type: typeof value === "boolean" ? "boolean" : typeof value === "number" ? "float" : "string" },
      ];
    }
  }

  return updated;
}

function getLensName(cameraId: number): string {
  const names: Record<number, string> = {
    0: "Main Wide Lens",
    1: "Front Selfie Camera",
    2: "Telephoto Lens",
    3: "Ultrawide Lens",
    4: "Macro Lens",
  };
  return names[cameraId] || `Camera ${cameraId}`;
}
