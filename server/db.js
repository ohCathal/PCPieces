import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, "bench.db"));

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS parts (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    specs TEXT NOT NULL
  )
`);

/* ---------------------------------------------------------
   STARTER CATALOG
   Only used to seed the database the first time it's created.
   After that, this file is never read again — the database is
   the source of truth, and you add/edit parts through the API
   (or directly in the parts table) instead of editing code.

   Covers three CPU sockets (AM5/DDR5, AM4/DDR4, LGA1700/DDR5)
   so the compatibility engine has real cross-generation cases
   to catch, not just one platform.
--------------------------------------------------------- */
const STARTER_PARTS = [
  // ---- CPUs: AM5 (DDR5) ----
  { id: "c1", category: "cpu", name: "AMD Ryzen 5 7600", price: 190, specs: { socket: "AM5", ramType: "DDR5", tdp: 65, tier: "Budget" } },
  { id: "c2", category: "cpu", name: "AMD Ryzen 5 7600X", price: 220, specs: { socket: "AM5", ramType: "DDR5", tdp: 105, tier: "Gaming" } },
  { id: "c3", category: "cpu", name: "AMD Ryzen 7 7700X", price: 299, specs: { socket: "AM5", ramType: "DDR5", tdp: 105, tier: "Gaming" } },
  { id: "c4", category: "cpu", name: "AMD Ryzen 7 7800X3D", price: 359, specs: { socket: "AM5", ramType: "DDR5", tdp: 120, tier: "Gaming" } },
  { id: "c5", category: "cpu", name: "AMD Ryzen 9 7900X", price: 429, specs: { socket: "AM5", ramType: "DDR5", tdp: 170, tier: "High-end" } },
  { id: "c6", category: "cpu", name: "AMD Ryzen 9 7950X", price: 549, specs: { socket: "AM5", ramType: "DDR5", tdp: 170, tier: "Enthusiast" } },
  { id: "c7", category: "cpu", name: "AMD Ryzen 9 7950X3D", price: 599, specs: { socket: "AM5", ramType: "DDR5", tdp: 120, tier: "Enthusiast" } },

  // ---- CPUs: AM4 (DDR4, older/budget platform) ----
  { id: "c8", category: "cpu", name: "AMD Ryzen 5 5600", price: 129, specs: { socket: "AM4", ramType: "DDR4", tdp: 65, tier: "Budget" } },
  { id: "c9", category: "cpu", name: "AMD Ryzen 5 5600X", price: 159, specs: { socket: "AM4", ramType: "DDR4", tdp: 65, tier: "Budget" } },
  { id: "c10", category: "cpu", name: "AMD Ryzen 7 5700X", price: 189, specs: { socket: "AM4", ramType: "DDR4", tdp: 65, tier: "Gaming" } },
  { id: "c11", category: "cpu", name: "AMD Ryzen 7 5800X3D", price: 279, specs: { socket: "AM4", ramType: "DDR4", tdp: 105, tier: "Gaming" } },
  { id: "c12", category: "cpu", name: "AMD Ryzen 9 5900X", price: 309, specs: { socket: "AM4", ramType: "DDR4", tdp: 105, tier: "High-end" } },
  { id: "c13", category: "cpu", name: "AMD Ryzen 9 5950X", price: 399, specs: { socket: "AM4", ramType: "DDR4", tdp: 105, tier: "Enthusiast" } },

  // ---- CPUs: LGA1700 (DDR5) ----
  { id: "c14", category: "cpu", name: "Intel Core i3-13100", price: 129, specs: { socket: "LGA1700", ramType: "DDR5", tdp: 60, tier: "Budget" } },
  { id: "c15", category: "cpu", name: "Intel Core i5-12600K", price: 219, specs: { socket: "LGA1700", ramType: "DDR5", tdp: 125, tier: "Gaming" } },
  { id: "c16", category: "cpu", name: "Intel Core i5-13600K", price: 259, specs: { socket: "LGA1700", ramType: "DDR5", tdp: 125, tier: "Gaming" } },
  { id: "c17", category: "cpu", name: "Intel Core i5-14600K", price: 269, specs: { socket: "LGA1700", ramType: "DDR5", tdp: 125, tier: "Gaming" } },
  { id: "c18", category: "cpu", name: "Intel Core i7-12700K", price: 299, specs: { socket: "LGA1700", ramType: "DDR5", tdp: 125, tier: "High-end" } },
  { id: "c19", category: "cpu", name: "Intel Core i7-13700K", price: 349, specs: { socket: "LGA1700", ramType: "DDR5", tdp: 125, tier: "High-end" } },
  { id: "c20", category: "cpu", name: "Intel Core i7-14700K", price: 379, specs: { socket: "LGA1700", ramType: "DDR5", tdp: 125, tier: "High-end" } },
  { id: "c21", category: "cpu", name: "Intel Core i9-12900K", price: 439, specs: { socket: "LGA1700", ramType: "DDR5", tdp: 125, tier: "Enthusiast" } },
  { id: "c22", category: "cpu", name: "Intel Core i9-13900K", price: 529, specs: { socket: "LGA1700", ramType: "DDR5", tdp: 125, tier: "Enthusiast" } },
  { id: "c23", category: "cpu", name: "Intel Core i9-14900K", price: 549, specs: { socket: "LGA1700", ramType: "DDR5", tdp: 125, tier: "Enthusiast" } },

  // ---- Motherboards: AM5 (DDR5) ----
  { id: "m1", category: "motherboard", name: "ASRock A620M-HDV", price: 89, specs: { socket: "AM5", ramType: "DDR5", formFactor: "mATX" } },
  { id: "m2", category: "motherboard", name: "MSI PRO B650-P WiFi", price: 149, specs: { socket: "AM5", ramType: "DDR5", formFactor: "ATX" } },
  { id: "m3", category: "motherboard", name: "Gigabyte B650 AORUS Elite AX", price: 189, specs: { socket: "AM5", ramType: "DDR5", formFactor: "ATX" } },
  { id: "m4", category: "motherboard", name: "ASRock B650M-HDV/M.2", price: 109, specs: { socket: "AM5", ramType: "DDR5", formFactor: "mATX" } },
  { id: "m5", category: "motherboard", name: "MSI MPG B650 Edge WiFi", price: 219, specs: { socket: "AM5", ramType: "DDR5", formFactor: "ATX" } },
  { id: "m6", category: "motherboard", name: "ASUS TUF Gaming B650M-Plus", price: 179, specs: { socket: "AM5", ramType: "DDR5", formFactor: "mATX" } },
  { id: "m7", category: "motherboard", name: "Gigabyte X670 AORUS Elite AX", price: 269, specs: { socket: "AM5", ramType: "DDR5", formFactor: "ATX" } },
  { id: "m8", category: "motherboard", name: "ASUS ROG Strix X670E-E Gaming", price: 449, specs: { socket: "AM5", ramType: "DDR5", formFactor: "ATX" } },
  { id: "m9", category: "motherboard", name: "MSI MEG X670E ACE", price: 549, specs: { socket: "AM5", ramType: "DDR5", formFactor: "ATX" } },

  // ---- Motherboards: AM4 (DDR4) ----
  { id: "m10", category: "motherboard", name: "ASRock A320M-HDV", price: 59, specs: { socket: "AM4", ramType: "DDR4", formFactor: "mATX" } },
  { id: "m11", category: "motherboard", name: "MSI B450 Tomahawk Max", price: 99, specs: { socket: "AM4", ramType: "DDR4", formFactor: "ATX" } },
  { id: "m12", category: "motherboard", name: "Gigabyte B450 AORUS M", price: 89, specs: { socket: "AM4", ramType: "DDR4", formFactor: "mATX" } },
  { id: "m13", category: "motherboard", name: "ASRock B550M Pro4", price: 99, specs: { socket: "AM4", ramType: "DDR4", formFactor: "mATX" } },
  { id: "m14", category: "motherboard", name: "ASUS ROG Strix B550-F Gaming", price: 159, specs: { socket: "AM4", ramType: "DDR4", formFactor: "ATX" } },
  { id: "m15", category: "motherboard", name: "Gigabyte X570 AORUS Elite", price: 189, specs: { socket: "AM4", ramType: "DDR4", formFactor: "ATX" } },
  { id: "m16", category: "motherboard", name: "ASUS ROG Crosshair VIII Hero", price: 349, specs: { socket: "AM4", ramType: "DDR4", formFactor: "ATX" } },

  // ---- Motherboards: LGA1700 (DDR5) ----
  { id: "m17", category: "motherboard", name: "ASRock H610M-HDV", price: 79, specs: { socket: "LGA1700", ramType: "DDR5", formFactor: "mATX" } },
  { id: "m18", category: "motherboard", name: "MSI PRO B760M-A WiFi", price: 139, specs: { socket: "LGA1700", ramType: "DDR5", formFactor: "mATX" } },
  { id: "m19", category: "motherboard", name: "ASRock B760M Pro RS", price: 129, specs: { socket: "LGA1700", ramType: "DDR5", formFactor: "mATX" } },
  { id: "m20", category: "motherboard", name: "Gigabyte B760 AORUS Elite AX", price: 169, specs: { socket: "LGA1700", ramType: "DDR5", formFactor: "ATX" } },
  { id: "m21", category: "motherboard", name: "ASUS Prime Z790-P WiFi", price: 199, specs: { socket: "LGA1700", ramType: "DDR5", formFactor: "ATX" } },
  { id: "m22", category: "motherboard", name: "Gigabyte Z790 AORUS Elite AX", price: 259, specs: { socket: "LGA1700", ramType: "DDR5", formFactor: "ATX" } },
  { id: "m23", category: "motherboard", name: "MSI MEG Z790 ACE", price: 599, specs: { socket: "LGA1700", ramType: "DDR5", formFactor: "ATX" } },

  // ---- RAM: DDR5 ----
  { id: "r1", category: "ram", name: "Crucial 16GB (2x8GB) DDR5-4800", price: 44, specs: { type: "DDR5", capacity: "16GB" } },
  { id: "r2", category: "ram", name: "Kingston Fury Beast 16GB (2x8GB) DDR5-5600", price: 59, specs: { type: "DDR5", capacity: "16GB" } },
  { id: "r3", category: "ram", name: "Corsair Vengeance 32GB (2x16GB) DDR5-6000", price: 89, specs: { type: "DDR5", capacity: "32GB" } },
  { id: "r4", category: "ram", name: "G.Skill Flare X5 32GB (2x16GB) DDR5-6000", price: 94, specs: { type: "DDR5", capacity: "32GB" } },
  { id: "r5", category: "ram", name: "Corsair Dominator Platinum 32GB (2x16GB) DDR5-6200", price: 129, specs: { type: "DDR5", capacity: "32GB" } },
  { id: "r6", category: "ram", name: "G.Skill Trident Z5 32GB (2x16GB) DDR5-6400", price: 119, specs: { type: "DDR5", capacity: "32GB" } },
  { id: "r7", category: "ram", name: "Corsair Vengeance 64GB (2x32GB) DDR5-6000", price: 179, specs: { type: "DDR5", capacity: "64GB" } },
  { id: "r8", category: "ram", name: "G.Skill Trident Z5 64GB (2x32GB) DDR5-6000", price: 189, specs: { type: "DDR5", capacity: "64GB" } },

  // ---- RAM: DDR4 ----
  { id: "r9", category: "ram", name: "Crucial 8GB (1x8GB) DDR4-3200", price: 22, specs: { type: "DDR4", capacity: "8GB" } },
  { id: "r10", category: "ram", name: "Kingston Fury Beast 16GB (2x8GB) DDR4-3200", price: 39, specs: { type: "DDR4", capacity: "16GB" } },
  { id: "r11", category: "ram", name: "Corsair Vengeance LPX 16GB (2x8GB) DDR4-3200", price: 42, specs: { type: "DDR4", capacity: "16GB" } },
  { id: "r12", category: "ram", name: "G.Skill Ripjaws V 32GB (2x16GB) DDR4-3600", price: 74, specs: { type: "DDR4", capacity: "32GB" } },
  { id: "r13", category: "ram", name: "Corsair Vengeance LPX 32GB (2x16GB) DDR4-3600", price: 79, specs: { type: "DDR4", capacity: "32GB" } },
  { id: "r14", category: "ram", name: "Corsair Vengeance LPX 64GB (2x32GB) DDR4-3600", price: 139, specs: { type: "DDR4", capacity: "64GB" } },

  // ---- GPUs are NOT in this list — see fetchGpuPartsFromApi() below.
  // They're pulled live from a real public GPU specs dataset instead
  // of being typed in by hand.

  // ---- Storage ----
  { id: "s1", category: "storage", name: "Crucial BX500 500GB SATA SSD", price: 29, specs: { capacity: "500GB" } },
  { id: "s2", category: "storage", name: "Kingston NV2 500GB NVMe SSD", price: 34, specs: { capacity: "500GB" } },
  { id: "s3", category: "storage", name: "Kingston NV2 1TB NVMe SSD", price: 54, specs: { capacity: "1TB" } },
  { id: "s4", category: "storage", name: "WD Blue SN580 500GB NVMe SSD", price: 39, specs: { capacity: "500GB" } },
  { id: "s5", category: "storage", name: "WD Black SN770 1TB NVMe SSD", price: 69, specs: { capacity: "1TB" } },
  { id: "s6", category: "storage", name: "WD Black SN850X 2TB NVMe SSD", price: 139, specs: { capacity: "2TB" } },
  { id: "s7", category: "storage", name: "Samsung 990 Pro 1TB NVMe SSD", price: 89, specs: { capacity: "1TB" } },
  { id: "s8", category: "storage", name: "Samsung 990 Pro 2TB NVMe SSD", price: 149, specs: { capacity: "2TB" } },
  { id: "s9", category: "storage", name: "Crucial P3 Plus 4TB NVMe SSD", price: 259, specs: { capacity: "4TB" } },
  { id: "s10", category: "storage", name: "Seagate BarraCuda 1TB HDD", price: 39, specs: { capacity: "1TB" } },
  { id: "s11", category: "storage", name: "Seagate BarraCuda 2TB HDD", price: 54, specs: { capacity: "2TB" } },
  { id: "s12", category: "storage", name: "Seagate BarraCuda 4TB HDD", price: 89, specs: { capacity: "4TB" } },

  // ---- PSUs ----
  { id: "p1", category: "psu", name: "EVGA 500 W1 500W 80+ White", price: 44, specs: { wattage: 500 } },
  { id: "p2", category: "psu", name: "Corsair CV550 550W 80+ Bronze", price: 54, specs: { wattage: 550 } },
  { id: "p3", category: "psu", name: "Corsair CV650 650W 80+ Bronze", price: 64, specs: { wattage: 650 } },
  { id: "p4", category: "psu", name: "Corsair RM650e 650W 80+ Gold", price: 89, specs: { wattage: 650 } },
  { id: "p5", category: "psu", name: "EVGA SuperNOVA 750 GT 750W 80+ Gold", price: 109, specs: { wattage: 750 } },
  { id: "p6", category: "psu", name: "MSI MPG A750G 750W 80+ Gold", price: 99, specs: { wattage: 750 } },
  { id: "p7", category: "psu", name: "MSI MPG A850G 850W 80+ Gold", price: 129, specs: { wattage: 850 } },
  { id: "p8", category: "psu", name: "Corsair RM850x 850W 80+ Gold", price: 139, specs: { wattage: 850 } },
  { id: "p9", category: "psu", name: "Corsair RM1000e 1000W 80+ Gold", price: 159, specs: { wattage: 1000 } },
  { id: "p10", category: "psu", name: "Corsair RM1200x 1200W 80+ Gold", price: 219, specs: { wattage: 1200 } },

  // ---- Cases ----
  { id: "cs1", category: "case", name: "Cooler Master MasterBox NR200", price: 99, specs: { formFactorSupport: ["ITX"], maxGpuLengthMM: 330 } },
  { id: "cs2", category: "case", name: "Fractal Design Terra", price: 189, specs: { formFactorSupport: ["ITX"], maxGpuLengthMM: 322 } },
  { id: "cs3", category: "case", name: "NZXT H5 Flow", price: 89, specs: { formFactorSupport: ["ATX", "mATX", "ITX"], maxGpuLengthMM: 365 } },
  { id: "cs4", category: "case", name: "Fractal Design Pop Air", price: 99, specs: { formFactorSupport: ["ATX", "mATX", "ITX"], maxGpuLengthMM: 355 } },
  { id: "cs5", category: "case", name: "Corsair 4000D Airflow", price: 104, specs: { formFactorSupport: ["ATX", "mATX", "ITX"], maxGpuLengthMM: 360 } },
  { id: "cs6", category: "case", name: "Lian Li Lancool 216", price: 109, specs: { formFactorSupport: ["ATX", "mATX", "ITX"], maxGpuLengthMM: 392 } },
  { id: "cs7", category: "case", name: "Fractal Design North", price: 149, specs: { formFactorSupport: ["ATX", "mATX", "ITX"], maxGpuLengthMM: 355 } },
  { id: "cs8", category: "case", name: "NZXT H7 Flow", price: 129, specs: { formFactorSupport: ["ATX", "mATX", "ITX"], maxGpuLengthMM: 400 } },
  { id: "cs9", category: "case", name: "Corsair 5000D Airflow", price: 174, specs: { formFactorSupport: ["ATX", "mATX", "ITX"], maxGpuLengthMM: 420 } },
  { id: "cs10", category: "case", name: "Lian Li O11 Dynamic EVO", price: 169, specs: { formFactorSupport: ["ATX", "mATX", "ITX"], maxGpuLengthMM: 422 } },

  // ---- Coolers ----
  { id: "co1", category: "cooler", name: "Cooler Master Hyper H410R", price: 24, specs: { supportedSockets: ["AM5", "AM4", "LGA1700"] } },
  { id: "co2", category: "cooler", name: "Thermalright Peerless Assassin 120 SE", price: 35, specs: { supportedSockets: ["AM5", "AM4", "LGA1700"] } },
  { id: "co3", category: "cooler", name: "Cooler Master Hyper 212 Halo", price: 45, specs: { supportedSockets: ["AM5", "AM4", "LGA1700"] } },
  { id: "co4", category: "cooler", name: "Noctua NH-U12S Redux", price: 55, specs: { supportedSockets: ["AM5", "AM4", "LGA1700"] } },
  { id: "co5", category: "cooler", name: "be quiet! Dark Rock 4", price: 74, specs: { supportedSockets: ["AM5", "AM4", "LGA1700"] } },
  { id: "co6", category: "cooler", name: "Noctua NH-D15", price: 109, specs: { supportedSockets: ["AM5", "AM4", "LGA1700"] } },
  { id: "co7", category: "cooler", name: "Corsair iCUE H100i 240mm AIO", price: 129, specs: { supportedSockets: ["AM5", "AM4", "LGA1700"] } },
  { id: "co8", category: "cooler", name: "NZXT Kraken 280mm AIO", price: 169, specs: { supportedSockets: ["AM5", "AM4", "LGA1700"] } },
  { id: "co9", category: "cooler", name: "Corsair iCUE H150i 360mm AIO", price: 199, specs: { supportedSockets: ["AM5", "AM4", "LGA1700"] } },
  { id: "co10", category: "cooler", name: "Lian Li Galahad II 360mm AIO", price: 159, specs: { supportedSockets: ["AM5", "AM4", "LGA1700"] } },
];

/* ---------------------------------------------------------
   LIVE GPU DATA
   Pulled from RightNow-AI/RightNow-GPU-Database on GitHub — a
   public, Apache-2.0-licensed dataset of real GPU specs sourced
   from TechPowerUp. We fetch tdp/length/memory for a curated
   list of desktop cards and merge in our own approximate prices
   (the dataset doesn't include pricing).

   If the fetch fails (offline, GitHub down, etc.) we fall back
   to a small hardcoded list so the app still works.
--------------------------------------------------------- */
const GPU_SOURCES = [
  { url: "https://raw.githubusercontent.com/RightNow-AI/RightNow-GPU-Database/main/data/nvidia/all.json" },
  { url: "https://raw.githubusercontent.com/RightNow-AI/RightNow-GPU-Database/main/data/amd/all.json" },
];

// name (must match the dataset exactly) -> our own price + performance tier
const GPU_PRICE_MAP = {
  "GeForce RTX 3050 8 GB": { price: 219, tier: "1080p" },
  "GeForce RTX 3060 12 GB": { price: 279, tier: "1080p" },
  "GeForce RTX 3060 Ti": { price: 329, tier: "1080p" },
  "GeForce RTX 3070": { price: 399, tier: "1440p" },
  "GeForce RTX 3080 12 GB": { price: 599, tier: "1440p" },
  "GeForce RTX 3090": { price: 799, tier: "4K" },
  "GeForce RTX 3090 Ti": { price: 899, tier: "4K" },
  "GeForce RTX 4060": { price: 299, tier: "1080p" },
  "GeForce RTX 4060 Ti 8 GB": { price: 399, tier: "1080p" },
  "GeForce RTX 4060 Ti 16 GB": { price: 449, tier: "1080p" },
  "GeForce RTX 4070": { price: 549, tier: "1440p" },
  "GeForce RTX 4070 SUPER": { price: 599, tier: "1440p" },
  "GeForce RTX 4070 Ti": { price: 749, tier: "1440p" },
  "GeForce RTX 4070 Ti SUPER": { price: 799, tier: "1440p" },
  "GeForce RTX 4080 SUPER": { price: 999, tier: "4K" },
  "GeForce RTX 4090": { price: 1599, tier: "4K" },
  "Radeon RX 6600": { price: 199, tier: "1080p" },
  "Radeon RX 6600 XT": { price: 259, tier: "1080p" },
  "Radeon RX 6700 XT": { price: 329, tier: "1440p" },
  "Radeon RX 6750 XT": { price: 379, tier: "1440p" },
  "Radeon RX 6800": { price: 429, tier: "1440p" },
  "Radeon RX 6800 XT": { price: 479, tier: "1440p" },
  "Radeon RX 6900 XT": { price: 549, tier: "1440p" },
  "Radeon RX 6950 XT": { price: 599, tier: "1440p" },
  "Radeon RX 7600": { price: 269, tier: "1080p" },
  "Radeon RX 7700 XT": { price: 419, tier: "1440p" },
  "Radeon RX 7800 XT": { price: 479, tier: "1440p" },
  "Radeon RX 7900 GRE": { price: 549, tier: "1440p" },
  "Radeon RX 7900 XT": { price: 699, tier: "4K" },
  "Radeon RX 7900 XTX": { price: 899, tier: "4K" },
};

const FALLBACK_GPUS = [
  { id: "g-fb1", category: "gpu", name: "GeForce RTX 4060", price: 299, specs: { tdp: 115, lengthMM: 240, tier: "1080p" } },
  { id: "g-fb2", category: "gpu", name: "GeForce RTX 4070 SUPER", price: 599, specs: { tdp: 220, lengthMM: 267, tier: "1440p" } },
  { id: "g-fb3", category: "gpu", name: "GeForce RTX 4080 SUPER", price: 999, specs: { tdp: 320, lengthMM: 310, tier: "4K" } },
  { id: "g-fb4", category: "gpu", name: "Radeon RX 7800 XT", price: 479, specs: { tdp: 263, lengthMM: 267, tier: "1440p" } },
  { id: "g-fb5", category: "gpu", name: "Radeon RX 7900 XTX", price: 899, specs: { tdp: 355, lengthMM: 287, tier: "4K" } },
];

async function fetchGpuPartsFromApi() {
  const results = [];
  for (const source of GPU_SOURCES) {
    const res = await fetch(source.url);
    if (!res.ok) throw new Error(`GPU dataset fetch failed: ${res.status}`);
    const list = await res.json();
    results.push(...list);
  }

  const parts = [];
  let n = 1;
  for (const [name, pricing] of Object.entries(GPU_PRICE_MAP)) {
    const match = results.find((g) => g.name === name);
    if (!match || !match.tdp || !match.length) continue; // skip if the dataset doesn't have what we need
    parts.push({
      id: `g${n++}`,
      category: "gpu",
      name,
      price: pricing.price,
      specs: { tdp: match.tdp, lengthMM: match.length, tier: pricing.tier },
    });
  }
  return parts;
}


async function seedIfEmpty() {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM parts").get();
  if (count > 0) return;

  let gpuParts;
  try {
    gpuParts = await fetchGpuPartsFromApi();
    console.log(`Fetched ${gpuParts.length} GPUs live from the public GPU database.`);
  } catch (err) {
    console.warn("Live GPU fetch failed, using fallback GPU list:", err.message);
    gpuParts = FALLBACK_GPUS;
  }

  const allParts = [...STARTER_PARTS, ...gpuParts];
  const insert = db.prepare("INSERT INTO parts (id, category, name, price, specs) VALUES (@id, @category, @name, @price, @specs)");
  const insertMany = db.transaction((parts) => {
    for (const part of parts) {
      insert.run({ ...part, specs: JSON.stringify(part.specs) });
    }
  });
  insertMany(allParts);
  console.log(`Seeded ${allParts.length} parts into bench.db`);
}
await seedIfEmpty();

export function getAllPartsGrouped() {
  const rows = db.prepare("SELECT * FROM parts").all();
  const grouped = {};
  for (const row of rows) {
    if (!grouped[row.category]) grouped[row.category] = [];
    grouped[row.category].push({
      id: row.id,
      name: row.name,
      price: row.price,
      ...JSON.parse(row.specs),
    });
  }
  return grouped;
}

export function addPart({ id, category, name, price, specs }) {
  db.prepare("INSERT INTO parts (id, category, name, price, specs) VALUES (?, ?, ?, ?, ?)")
    .run(id, category, name, price, JSON.stringify(specs || {}));
}

export function deletePart(id) {
  const result = db.prepare("DELETE FROM parts WHERE id = ?").run(id);
  return result.changes > 0;
}

export default db;