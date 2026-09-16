/**
 * Allocates a budget across categories by use case, then picks the
 * best-value compatible part in each one. Pure functions — no state,
 * no side effects — so the picking logic can be reasoned about (and
 * tested) independently of the UI that calls it.
 */
export const USE_CASES = {
  gaming: {
    label: "Gaming",
    weights: { gpu: 0.36, cpu: 0.22, motherboard: 0.08, ram: 0.07, storage: 0.07, psu: 0.07, case: 0.07, cooler: 0.06 },
  },
  creator: {
    label: "Creator / workstation",
    weights: { cpu: 0.28, gpu: 0.22, ram: 0.14, storage: 0.11, motherboard: 0.09, psu: 0.07, case: 0.05, cooler: 0.04 },
  },
  everyday: {
    label: "Everyday / budget",
    weights: { cpu: 0.20, gpu: 0.18, motherboard: 0.13, ram: 0.11, storage: 0.13, psu: 0.11, case: 0.08, cooler: 0.06 },
  },
};

function pickWithinBudget(pool, target) {
  if (!pool || pool.length === 0) return null;
  const sorted = [...pool].sort((a, b) => a.price - b.price);
  let choice = null;
  for (const item of sorted) {
    if (item.price <= target * 1.05) choice = item; // best value that still fits a stretched allocation
  }
  return choice || sorted[0]; // fall back to the cheapest option in the category
}

export function autoPickBuildForBudget(catalog, budget, useCaseKey) {
  const weights = USE_CASES[useCaseKey].weights;
  const targetFor = (cat) => budget * weights[cat];

  const cpu = pickWithinBudget(catalog.cpu, targetFor("cpu"));
  const motherboard = pickWithinBudget(catalog.motherboard.filter((m) => m.socket === cpu.socket), targetFor("motherboard"));
  const ram = pickWithinBudget(catalog.ram.filter((r) => r.type === motherboard.ramType), targetFor("ram"));
  const gpu = pickWithinBudget(catalog.gpu, targetFor("gpu"));
  const storage = pickWithinBudget(catalog.storage, targetFor("storage"));
  const cooler = pickWithinBudget(catalog.cooler.filter((c) => c.supportedSockets.includes(cpu.socket)), targetFor("cooler"));

  const estimatedDraw = (cpu.tdp || 0) + (gpu.tdp || 0) + 120;
  const recommendedWattage = Math.ceil((estimatedDraw * 1.3) / 50) * 50;
  const psuPool = catalog.psu.filter((p) => p.wattage >= recommendedWattage);
  const psu = pickWithinBudget(psuPool, targetFor("psu")) || [...catalog.psu].sort((a, b) => b.wattage - a.wattage)[0];

  const casePool = catalog.case.filter(
    (c) => c.formFactorSupport.includes(motherboard.formFactor) && c.maxGpuLengthMM >= gpu.lengthMM
  );
  const pcCase =
    pickWithinBudget(casePool, targetFor("case")) ||
    catalog.case.find((c) => c.formFactorSupport.includes(motherboard.formFactor)) ||
    catalog.case[0];

  return { cpu, motherboard, ram, gpu, storage, psu, case: pcCase, cooler };
}
