/**
 * Checks a build for socket/RAM/case/cooler mismatches and estimates
 * power draw. Pure function: same input always gives the same output,
 * which makes it easy to test in isolation from the UI.
 */
export function checkCompatibility(build) {
  const issues = [];
  const { cpu, motherboard, ram, gpu, case: pcCase, psu, cooler } = build;

  if (cpu && motherboard && cpu.socket !== motherboard.socket) {
    issues.push(`${cpu.name} uses ${cpu.socket}, but ${motherboard.name} is ${motherboard.socket}. These won't fit together.`);
  }
  if (motherboard && ram && motherboard.ramType !== ram.type) {
    issues.push(`${motherboard.name} takes ${motherboard.ramType}, but ${ram.name} is ${ram.type}.`);
  }
  if (motherboard && pcCase && !pcCase.formFactorSupport.includes(motherboard.formFactor)) {
    issues.push(`${pcCase.name} doesn't support ${motherboard.formFactor} boards like ${motherboard.name}.`);
  }
  if (gpu && pcCase && gpu.lengthMM > pcCase.maxGpuLengthMM) {
    issues.push(`${gpu.name} is ${gpu.lengthMM}mm long, longer than the ${pcCase.maxGpuLengthMM}mm ${pcCase.name} allows.`);
  }
  if (cpu && cooler && !cooler.supportedSockets.includes(cpu.socket)) {
    issues.push(`${cooler.name} doesn't list support for the ${cpu.socket} socket ${cpu.name} uses.`);
  }

  const estimatedDraw = (cpu?.tdp || 0) + (gpu?.tdp || 0) + 120; // baseline for board/drives/fans
  const recommendedWattage = Math.ceil((estimatedDraw * 1.3) / 50) * 50;
  if (psu && psu.wattage < recommendedWattage) {
    issues.push(`Estimated draw is ~${estimatedDraw}W. ${psu.name} (${psu.wattage}W) is under the ~${recommendedWattage}W recommended headroom.`);
  }

  return { issues, estimatedDraw, recommendedWattage };
}
