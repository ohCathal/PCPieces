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
--------------------------------------------------------- */
const STARTER_PARTS = [
  { id: "c1", category: "cpu", name: "AMD Ryzen 5 7600", price: 190, specs: { socket: "AM5", ramType: "DDR5", tdp: 65, tier: "Budget" } },
  { id: "c2", category: "cpu", name: "AMD Ryzen 7 7800X3D", price: 359, specs: { socket: "AM5", ramType: "DDR5", tdp: 120, tier: "Gaming" } },
  { id: "c3", category: "cpu", name: "AMD Ryzen 9 7950X3D", price: 549, specs: { socket: "AM5", ramType: "DDR5", tdp: 120, tier: "High-end" } },
  { id: "c4", category: "cpu", name: "Intel Core i5-14600K", price: 269, specs: { socket: "LGA1700", ramType: "DDR5", tdp: 125, tier: "Gaming" } },
  { id: "c5", category: "cpu", name: "Intel Core i7-14700K", price: 379, specs: { socket: "LGA1700", ramType: "DDR5", tdp: 125, tier: "High-end" } },
  { id: "c6", category: "cpu", name: "Intel Core i9-14900K", price: 549, specs: { socket: "LGA1700", ramType: "DDR5", tdp: 125, tier: "Enthusiast" } },

  { id: "m1", category: "motherboard", name: "MSI PRO B650-P WiFi", price: 149, specs: { socket: "AM5", ramType: "DDR5", formFactor: "ATX" } },
  { id: "m2", category: "motherboard", name: "Gigabyte B650 AORUS Elite AX", price: 189, specs: { socket: "AM5", ramType: "DDR5", formFactor: "ATX" } },
  { id: "m3", category: "motherboard", name: "ASRock B650M-HDV/M.2", price: 109, specs: { socket: "AM5", ramType: "DDR5", formFactor: "mATX" } },
  { id: "m4", category: "motherboard", name: "ASUS Prime Z790-P WiFi", price: 199, specs: { socket: "LGA1700", ramType: "DDR5", formFactor: "ATX" } },
  { id: "m5", category: "motherboard", name: "MSI PRO B760M-A WiFi", price: 139, specs: { socket: "LGA1700", ramType: "DDR5", formFactor: "mATX" } },

  { id: "r1", category: "ram", name: "Corsair Vengeance 32GB (2x16GB) DDR5-6000", price: 89, specs: { type: "DDR5", capacity: "32GB" } },
  { id: "r2", category: "ram", name: "G.Skill Flare X5 32GB (2x16GB) DDR5-6000", price: 94, specs: { type: "DDR5", capacity: "32GB" } },
  { id: "r3", category: "ram", name: "Corsair Vengeance 64GB (2x32GB) DDR5-6000", price: 179, specs: { type: "DDR5", capacity: "64GB" } },

  { id: "g1", category: "gpu", name: "MSI RTX 4060 Ventus 2X", price: 299, specs: { tdp: 115, lengthMM: 245, tier: "1080p" } },
  { id: "g2", category: "gpu", name: "ASUS Dual RTX 4070 Super", price: 599, specs: { tdp: 220, lengthMM: 267, tier: "1440p" } },
  { id: "g3", category: "gpu", name: "Gigabyte RTX 4080 Super Gaming OC", price: 999, specs: { tdp: 320, lengthMM: 336, tier: "4K" } },
  { id: "g4", category: "gpu", name: "MSI Radeon RX 7800 XT Gaming X Trio", price: 499, specs: { tdp: 263, lengthMM: 322, tier: "1440p" } },

  { id: "s1", category: "storage", name: "WD Black SN770 1TB NVMe SSD", price: 69, specs: { capacity: "1TB" } },
  { id: "s2", category: "storage", name: "Samsung 990 Pro 2TB NVMe SSD", price: 149, specs: { capacity: "2TB" } },
  { id: "s3", category: "storage", name: "Crucial P3 Plus 4TB NVMe SSD", price: 259, specs: { capacity: "4TB" } },

  { id: "p1", category: "psu", name: "Corsair RM650e 650W 80+ Gold", price: 89, specs: { wattage: 650 } },
  { id: "p2", category: "psu", name: "EVGA SuperNOVA 750 GT 750W 80+ Gold", price: 109, specs: { wattage: 750 } },
  { id: "p3", category: "psu", name: "Corsair RM1000e 1000W 80+ Gold", price: 159, specs: { wattage: 1000 } },

  { id: "cs1", category: "case", name: "NZXT H5 Flow", price: 89, specs: { formFactorSupport: ["ATX", "mATX", "ITX"], maxGpuLengthMM: 365 } },
  { id: "cs2", category: "case", name: "Fractal Design Pop Air", price: 99, specs: { formFactorSupport: ["ATX", "mATX", "ITX"], maxGpuLengthMM: 355 } },
  { id: "cs3", category: "case", name: "Cooler Master MasterBox NR200", price: 99, specs: { formFactorSupport: ["ITX"], maxGpuLengthMM: 330 } },

  { id: "co1", category: "cooler", name: "Cooler Master Hyper 212 Halo", price: 45, specs: { supportedSockets: ["AM5", "LGA1700"] } },
  { id: "co2", category: "cooler", name: "Corsair iCUE H100i 240mm AIO", price: 129, specs: { supportedSockets: ["AM5", "LGA1700"] } },
  { id: "co3", category: "cooler", name: "NZXT Kraken 280mm AIO", price: 169, specs: { supportedSockets: ["AM5", "LGA1700"] } },
];

function seedIfEmpty() {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM parts").get();
  if (count > 0) return;

  const insert = db.prepare("INSERT INTO parts (id, category, name, price, specs) VALUES (@id, @category, @name, @price, @specs)");
  const insertMany = db.transaction((parts) => {
    for (const part of parts) {
      insert.run({ ...part, specs: JSON.stringify(part.specs) });
    }
  });
  insertMany(STARTER_PARTS);
  console.log(`Seeded ${STARTER_PARTS.length} parts into bench.db`);
}
seedIfEmpty();

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