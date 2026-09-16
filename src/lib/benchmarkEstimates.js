export const GAMES_BY_CATEGORY = {
  esports: ["Valorant", "Counter-Strike 2", "Fortnite", "Apex Legends"],
  aaa: ["Cyberpunk 2077", "Baldur's Gate 3", "Grand Theft Auto V", "Black Myth: Wukong"],
};

const GAME_FPS_BY_TIER = {
  "1080p": {
    "Valorant": [180, 300],
    "Counter-Strike 2": [150, 250],
    "Fortnite": [90, 150],
    "Apex Legends": [100, 160],
    "Cyberpunk 2077": [55, 85],
    "Baldur's Gate 3": [60, 90],
    "Grand Theft Auto V": [90, 140],
    "Black Myth: Wukong": [40, 60],
  },
  "1440p": {
    "Valorant": [160, 260],
    "Counter-Strike 2": [130, 220],
    "Fortnite": [75, 120],
    "Apex Legends": [85, 140],
    "Cyberpunk 2077": [65, 90],
    "Baldur's Gate 3": [70, 100],
    "Grand Theft Auto V": [75, 110],
    "Black Myth: Wukong": [45, 70],
  },
  "4K": {
    "Valorant": [140, 220],
    "Counter-Strike 2": [110, 190],
    "Fortnite": [70, 110],
    "Apex Legends": [75, 120],
    "Cyberpunk 2077": [55, 85],
    "Baldur's Gate 3": [60, 90],
    "Grand Theft Auto V": [65, 100],
    "Black Myth: Wukong": [45, 75],
  },
};

const BLENDER_SCORE_BY_TIER = {
  "1080p": { range: [2500, 4200], anchor: "similar to an RTX 4060 (~3,133)" },
  "1440p": { range: [4200, 7500], anchor: "similar to an RTX 4070 (~5,399)" },
  "4K": { range: [7500, 12500], anchor: "similar to an RTX 4090 (~11,688)" },
};

const CPU_WORKSTATION_NOTES = {
  Budget: "Fine for light editing and 1080p exports; longer exports on 4K footage.",
  Gaming: "Comfortable with 1080p-1440p editing and exports at reasonable speed.",
  "High-end": "Handles 4K editing and exports well; multitasking while rendering is fine.",
  Enthusiast: "Built for heavy timelines, 4K/8K footage, and fast exports without waiting around.",
};

export function estimatePerformance(cpu, gpu) {
  if (!cpu || !gpu) return null;

  const tier = gpu.tier;
  const gameFps = GAME_FPS_BY_TIER[tier] || GAME_FPS_BY_TIER["1080p"];
  const blender = BLENDER_SCORE_BY_TIER[tier] || BLENDER_SCORE_BY_TIER["1080p"];

  const CPU_TIER_RANK = { Budget: 0, Gaming: 1, "High-end": 2, Enthusiast: 3 };
  const GPU_TIER_RANK = { "1080p": 0, "1440p": 1, "4K": 2 };
  const bottleneck =
    CPU_TIER_RANK[cpu.tier] != null &&
    GPU_TIER_RANK[tier] != null &&
    CPU_TIER_RANK[cpu.tier] < GPU_TIER_RANK[tier] - 1;

  return {
    gpuTier: tier,
    games: gameFps,
    blenderScoreRange: blender.range,
    blenderAnchor: blender.anchor,
    workstationNote: CPU_WORKSTATION_NOTES[cpu.tier] || CPU_WORKSTATION_NOTES.Gaming,
    bottleneck,
  };
}