import { Cpu, CircuitBoard, MemoryStick, HardDrive, Zap, Box, Fan, MonitorSmartphone } from "lucide-react";

// The parts catalog itself is NOT hardcoded here — it's fetched from
// GET /api/parts, which reads from the SQLite database (server/db.js).
// This file only holds category metadata and small pure helpers.

export const CATEGORY_META = [
  { key: "cpu", label: "Processor", icon: Cpu },
  { key: "motherboard", label: "Motherboard", icon: CircuitBoard },
  { key: "ram", label: "Memory", icon: MemoryStick },
  { key: "gpu", label: "Graphics card", icon: MonitorSmartphone },
  { key: "storage", label: "Storage", icon: HardDrive },
  { key: "psu", label: "Power supply", icon: Zap },
  { key: "case", label: "Case", icon: Box },
  { key: "cooler", label: "Cooler", icon: Fan },
];

export const emptyBuild = () => ({
  cpu: null,
  motherboard: null,
  ram: null,
  gpu: null,
  storage: null,
  psu: null,
  case: null,
  cooler: null,
});

export const searchLink = (name) => `https://www.amazon.com/s?k=${encodeURIComponent(name)}`;

export function specLine(category, part) {
  switch (category) {
    case "cpu": return `${part.socket} · ${part.ramType} · ${part.tdp}W TDP · ${part.tier}`;
    case "motherboard": return `${part.socket} · ${part.formFactor} · ${part.ramType}`;
    case "ram": return `${part.type} · ${part.capacity}`;
    case "gpu": return `${part.tdp}W · ${part.lengthMM}mm · ${part.tier}`;
    case "storage": return `${part.capacity} NVMe`;
    case "psu": return `${part.wattage}W · 80+ Gold`;
    case "case": return `Fits ${part.formFactorSupport.join(", ")} · up to ${part.maxGpuLengthMM}mm GPU`;
    case "cooler": return `Supports ${part.supportedSockets.join(", ")}`;
    default: return "";
  }
}
