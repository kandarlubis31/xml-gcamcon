// ============================================================
// xml-gcamcon — Schema Registry
// ============================================================

import type { GcamPortSchema, GcamPortId } from "@/types";
import { bsgSchema } from "./bsg";
import { lmcSchema } from "./lmc";
import { arnovaSchema } from "./arnova";
import { agcSchema } from "./agc";

export const gcamPorts: Record<GcamPortId, GcamPortSchema> = {
  bsg: bsgSchema,
  lmc: lmcSchema,
  arnova: arnovaSchema,
  agc: agcSchema,
};

export const gcamPortList = Object.values(gcamPorts).map((s) => ({
  id: s.meta.id,
  name: s.meta.name,
  developer: s.meta.developer,
  description: s.meta.description,
  recommendedVersion: s.meta.recommendedVersion,
  configFolder: s.meta.configFolder,
}));

export function getPortSchema(portId: GcamPortId): GcamPortSchema {
  return gcamPorts[portId];
}

export { bsgSchema, lmcSchema, arnovaSchema, agcSchema };
