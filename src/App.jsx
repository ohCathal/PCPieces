import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Cpu, CircuitBoard, MemoryStick, HardDrive, Zap, Box, Fan, MonitorSmartphone, Lock, LogOut, Sparkles, AlertTriangle, CheckCircle2, ExternalLink, Trash2, User } from "lucide-react";

/* ---------------------------------------------------------
   PARTS CATALOG
   Curated, illustrative data — prices are approximate and
   should be refreshed periodically. Links are live Amazon
   search links (not fixed product pages, so they won't rot).
--------------------------------------------------------- */

const searchLink = (name) => `https://www.amazon.com/s?k=${encodeURIComponent(name)}`;

const CATALOG = {
  cpu: [
    { id: "c1", name: "AMD Ryzen 5 7600", socket: "AM5", ramType: "DDR5", tdp: 65, price: 190, tier: "Budget" },
    { id: "c2", name: "AMD Ryzen 7 7800X3D", socket: "AM5", ramType: "DDR5", tdp: 120, price: 359, tier: "Gaming" },
    { id: "c3", name: "AMD Ryzen 9 7950X3D", socket: "AM5", ramType: "DDR5", tdp: 120, price: 549, tier: "High-end" },
    { id: "c4", name: "Intel Core i5-14600K", socket: "LGA1700", ramType: "DDR5", tdp: 125, price: 269, tier: "Gaming" },
    { id: "c5", name: "Intel Core i7-14700K", socket: "LGA1700", ramType: "DDR5", tdp: 125, price: 379, tier: "High-end" },
    { id: "c6", name: "Intel Core i9-14900K", socket: "LGA1700", ramType: "DDR5", tdp: 125, price: 549, tier: "Enthusiast" },
  ],
  motherboard: [
    { id: "m1", name: "MSI PRO B650-P WiFi", socket: "AM5", ramType: "DDR5", formFactor: "ATX", price: 149 },
    { id: "m2", name: "Gigabyte B650 AORUS Elite AX", socket: "AM5", ramType: "DDR5", formFactor: "ATX", price: 189 },
    { id: "m3", name: "ASRock B650M-HDV/M.2", socket: "AM5", ramType: "DDR5", formFactor: "mATX", price: 109 },
    { id: "m4", name: "ASUS Prime Z790-P WiFi", socket: "LGA1700", ramType: "DDR5", formFactor: "ATX", price: 199 },
    { id: "m5", name: "MSI PRO B760M-A WiFi", socket: "LGA1700", ramType: "DDR5", formFactor: "mATX", price: 139 },
  ],
  ram: [
    { id: "r1", name: "Corsair Vengeance 32GB (2x16GB) DDR5-6000", type: "DDR5", capacity: "32GB", price: 89 },
    { id: "r2", name: "G.Skill Flare X5 32GB (2x16GB) DDR5-6000", type: "DDR5", capacity: "32GB", price: 94 },
    { id: "r3", name: "Corsair Vengeance 64GB (2x32GB) DDR5-6000", type: "DDR5", capacity: "64GB", price: 179 },
  ],
  gpu: [
    { id: "g1", name: "MSI RTX 4060 Ventus 2X", tdp: 115, lengthMM: 245, price: 299, tier: "1080p" },
    { id: "g2", name: "ASUS Dual RTX 4070 Super", tdp: 220, lengthMM: 267, price: 599, tier: "1440p" },
    { id: "g3", name: "Gigabyte RTX 4080 Super Gaming OC", tdp: 320, lengthMM: 336, price: 999, tier: "4K" },
    { id: "g4", name: "MSI Radeon RX 7800 XT Gaming X Trio", tdp: 263, lengthMM: 322, price: 499, tier: "1440p" },
  ],
  storage: [
    { id: "s1", name: "WD Black SN770 1TB NVMe SSD", capacity: "1TB", price: 69 },
    { id: "s2", name: "Samsung 990 Pro 2TB NVMe SSD", capacity: "2TB", price: 149 },
    { id: "s3", name: "Crucial P3 Plus 4TB NVMe SSD", capacity: "4TB", price: 259 },
  ],
  psu: [
    { id: "p1", name: "Corsair RM650e 650W 80+ Gold", wattage: 650, price: 89 },
    { id: "p2", name: "EVGA SuperNOVA 750 GT 750W 80+ Gold", wattage: 750, price: 109 },
    { id: "p3", name: "Corsair RM1000e 1000W 80+ Gold", wattage: 1000, price: 159 },
  ],
  case: [
    { id: "cs1", name: "NZXT H5 Flow", formFactorSupport: ["ATX", "mATX", "ITX"], maxGpuLengthMM: 365, price: 89 },
    { id: "cs2", name: "Fractal Design Pop Air", formFactorSupport: ["ATX", "mATX", "ITX"], maxGpuLengthMM: 355, price: 99 },
    { id: "cs3", name: "Cooler Master MasterBox NR200", formFactorSupport: ["ITX"], maxGpuLengthMM: 330, price: 99 },
  ],
  cooler: [
    { id: "co1", name: "Cooler Master Hyper 212 Halo", supportedSockets: ["AM5", "LGA1700"], price: 45 },
    { id: "co2", name: "Corsair iCUE H100i 240mm AIO", supportedSockets: ["AM5", "LGA1700"], price: 129 },
    { id: "co3", name: "NZXT Kraken 280mm AIO", supportedSockets: ["AM5", "LGA1700"], price: 169 },
  ],
};

const CATEGORY_META = [
  { key: "cpu", label: "Processor", icon: Cpu },
  { key: "motherboard", label: "Motherboard", icon: CircuitBoard },
  { key: "ram", label: "Memory", icon: MemoryStick },
  { key: "gpu", label: "Graphics card", icon: MonitorSmartphone },
  { key: "storage", label: "Storage", icon: HardDrive },
  { key: "psu", label: "Power supply", icon: Zap },
  { key: "case", label: "Case", icon: Box },
  { key: "cooler", label: "Cooler", icon: Fan },
];

const emptyBuild = () => ({ cpu: null, motherboard: null, ram: null, gpu: null, storage: null, psu: null, case: null, cooler: null });

/* ---------------------------------------------------------
   COMPATIBILITY ENGINE
--------------------------------------------------------- */
function checkCompatibility(build) {
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

/* ---------------------------------------------------------
   STORAGE HELPERS
   Uses localStorage, so profiles live only in this browser
   on this device. Swap these three functions for real API
   calls to a backend + database if you want profiles to
   follow a person across devices.
--------------------------------------------------------- */
async function loadProfile(username) {
  try {
    const raw = localStorage.getItem(`profile:${username}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
async function saveProfile(username, data) {
  try {
    localStorage.setItem(`profile:${username}`, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
async function listProfiles() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("profile:")) keys.push(key.replace("profile:", ""));
    }
    return keys;
  } catch {
    return [];
  }
}

/* ---------------------------------------------------------
   MAIN APP
--------------------------------------------------------- */
export default function PCBuildTool() {
  const [stage, setStage] = useState("gate"); // gate | dashboard
  const [knownProfiles, setKnownProfiles] = useState([]);
  const [usernameInput, setUsernameInput] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [gateError, setGateError] = useState("");
  const [gateMode, setGateMode] = useState("select"); // select | create

  const [activeUser, setActiveUser] = useState(null);
  const [build, setBuild] = useState(emptyBuild());
  const [activeCategory, setActiveCategory] = useState("cpu");

  const [aiLoading, setAiLoading] = useState(false);
  const [aiText, setAiText] = useState("");
  const [aiError, setAiError] = useState("");

  const [saveFlash, setSaveFlash] = useState(false);

  useEffect(() => {
    listProfiles().then(setKnownProfiles);
  }, []);

  const compat = useMemo(() => checkCompatibility(build), [build]);
  const total = useMemo(
    () => Object.values(build).reduce((sum, p) => sum + (p ? p.price : 0), 0),
    [build]
  );

  const handleCreateProfile = async () => {
    const name = usernameInput.trim();
    if (!name) { setGateError("Enter a profile name."); return; }
    if (pinInput.length < 4) { setGateError("PIN needs at least 4 digits."); return; }
    const existing = await loadProfile(name);
    if (existing) { setGateError("That profile already exists. Choose sign in instead."); return; }
    const data = { pin: pinInput, build: emptyBuild() };
    await saveProfile(name, data);
    setActiveUser(name);
    setBuild(emptyBuild());
    setStage("dashboard");
    setKnownProfiles((prev) => [...prev, name]);
  };

  const handleSignIn = async () => {
    const name = usernameInput.trim();
    if (!name) { setGateError("Enter a profile name."); return; }
    const data = await loadProfile(name);
    if (!data) { setGateError("No profile with that name yet. Switch to create one."); return; }
    if (data.pin !== pinInput) { setGateError("Incorrect PIN."); return; }
    setActiveUser(name);
    setBuild({ ...emptyBuild(), ...data.build });
    setStage("dashboard");
  };

  const handleSaveBuild = useCallback(async () => {
    if (!activeUser) return;
    const data = await loadProfile(activeUser);
    await saveProfile(activeUser, { ...data, build });
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1400);
  }, [activeUser, build]);

  const handleSignOut = () => {
    setStage("gate");
    setActiveUser(null);
    setBuild(emptyBuild());
    setAiText("");
    setUsernameInput("");
    setPinInput("");
    setGateError("");
  };

  const selectPart = (category, part) => {
    setBuild((prev) => ({ ...prev, [category]: part }));
  };

  const clearPart = (category) => {
    setBuild((prev) => ({ ...prev, [category]: null }));
  };

  const getAIRecommendations = async () => {
    setAiLoading(true);
    setAiError("");
    setAiText("");
    const chosen = Object.entries(build).filter(([, v]) => v);
    if (chosen.length === 0) {
      setAiError("Pick at least one part first so there's something to analyze.");
      setAiLoading(false);
      return;
    }
    const summary = chosen.map(([cat, p]) => `${cat}: ${p.name} ($${p.price})`).join("\n");
    const prompt = `You are a PC building assistant. Here is a user's current build:\n${summary}\n\nTotal so far: $${total}. Estimated power draw: ${compat.estimatedDraw}W.\n${compat.issues.length ? `Known compatibility issues: ${compat.issues.join(" ")}` : "No compatibility issues detected so far."}\n\nGive concise, practical recommendations: what to add next given what's missing, whether anything is a bottleneck or mismatched for the apparent use case (e.g. a strong GPU paired with a weak CPU), and one or two specific upgrade suggestions. Keep it under 150 words, plain text, no markdown headers.`;

    try {
      // Calls our own backend (server/index.js), which holds the Anthropic
      // API key and forwards the request — the browser never sees the key.
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error("Request failed");
      const data = await response.json();
      setAiText(data.text || "No response returned.");
    } catch (e) {
      setAiError("Couldn't reach the recommendation service. Make sure the backend server is running.");
    } finally {
      setAiLoading(false);
    }
  };

  /* ------------------- RENDER: GATE ------------------- */
  if (stage === "gate") {
    return (
      <div style={styles.page}>
        <FontLoad />
        <div style={styles.gateWrap}>
          <div style={styles.gateCorner} />
          <div style={styles.gateHeader}>
            <CircuitBoard size={28} color="var(--copper)" strokeWidth={1.5} />
            <div>
              <div style={styles.brand}>Bench</div>
              <div style={styles.brandSub}>build planner</div>
            </div>
          </div>

          <div style={styles.gateTabs}>
            <button
              onClick={() => { setGateMode("select"); setGateError(""); }}
              style={{ ...styles.gateTab, ...(gateMode === "select" ? styles.gateTabActive : {}) }}
            >
              Sign in
            </button>
            <button
              onClick={() => { setGateMode("create"); setGateError(""); }}
              style={{ ...styles.gateTab, ...(gateMode === "create" ? styles.gateTabActive : {}) }}
            >
              New profile
            </button>
          </div>

          <div style={styles.gateForm}>
            <label style={styles.label}>Profile name</label>
            <input
              style={styles.input}
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="e.g. jordan"
              list="known-profiles"
            />
            <datalist id="known-profiles">
              {knownProfiles.map((p) => <option key={p} value={p} />)}
            </datalist>

            <label style={styles.label}>PIN</label>
            <input
              style={styles.input}
              type="password"
              inputMode="numeric"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="4+ digits"
              onKeyDown={(e) => e.key === "Enter" && (gateMode === "select" ? handleSignIn() : handleCreateProfile())}
            />

            {gateError && <div style={styles.gateError}><AlertTriangle size={14} /> {gateError}</div>}

            <button style={styles.primaryBtn} onClick={gateMode === "select" ? handleSignIn : handleCreateProfile}>
              <Lock size={15} /> {gateMode === "select" ? "Sign in" : "Create profile & continue"}
            </button>

            <p style={styles.gateNote}>
              This PIN keeps your saved build separate from other profiles on this device. It's stored locally to your account,
              not encrypted authentication — don't reuse a real password here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------- RENDER: DASHBOARD ------------------- */
  const activePart = build[activeCategory];
  const options = CATALOG[activeCategory];
  const noIssues = compat.issues.length === 0;

  return (
    <div style={styles.page}>
      <FontLoad />
      <div style={styles.shell}>
        {/* Top bar */}
        <div style={styles.topBar}>
          <div style={styles.topBarLeft}>
            <CircuitBoard size={22} color="var(--copper)" strokeWidth={1.5} />
            <span style={styles.brand}>Bench</span>
          </div>
          <div style={styles.topBarRight}>
            <span style={styles.userChip}><User size={13} /> {activeUser}</span>
            <button style={styles.iconBtn} onClick={handleSaveBuild} title="Save build">
              {saveFlash ? "Saved" : "Save"}
            </button>
            <button style={styles.iconBtn} onClick={handleSignOut} title="Sign out">
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* Hero stats */}
        <div style={styles.hero}>
          <div style={styles.heroFigure}>
            <div style={styles.heroLabel}>Build total</div>
            <div style={styles.heroNumber}>${total.toLocaleString()}</div>
          </div>
          <div style={styles.heroDivider} />
          <div style={styles.heroFigure}>
            <div style={styles.heroLabel}>Estimated draw</div>
            <div style={styles.heroNumberSmall}>{compat.estimatedDraw}W</div>
            <div style={styles.heroSubtext}>recommend {compat.recommendedWattage}W+ PSU</div>
          </div>
          <div style={styles.heroDivider} />
          <div style={styles.heroFigure}>
            <div style={styles.heroLabel}>Compatibility</div>
            <div style={{ ...styles.statusBadge, ...(noIssues ? styles.statusOk : styles.statusBad) }}>
              {noIssues ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              {noIssues ? "Looks compatible" : `${compat.issues.length} issue${compat.issues.length > 1 ? "s" : ""}`}
            </div>
          </div>
        </div>

        {compat.issues.length > 0 && (
          <div style={styles.issuesPanel}>
            {compat.issues.map((issue, i) => (
              <div key={i} style={styles.issueRow}><AlertTriangle size={13} color="var(--danger)" /> {issue}</div>
            ))}
          </div>
        )}

        <div style={styles.mainGrid}>
          {/* Category rail */}
          <div style={styles.rail}>
            {CATEGORY_META.map(({ key, label, icon: Icon }) => {
              const filled = !!build[key];
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  style={{ ...styles.railItem, ...(activeCategory === key ? styles.railItemActive : {}) }}
                >
                  <Icon size={16} strokeWidth={1.6} />
                  <div style={styles.railText}>
                    <div style={styles.railLabel}>{label}</div>
                    <div style={styles.railSub}>{filled ? build[key].name : "Not selected"}</div>
                  </div>
                  {filled && <span style={styles.railDot} />}
                </button>
              );
            })}
          </div>

          {/* Options panel */}
          <div style={styles.optionsPanel}>
            <div style={styles.optionsPanelHeader}>
              <span>{CATEGORY_META.find((c) => c.key === activeCategory).label}</span>
              {activePart && (
                <button style={styles.clearBtn} onClick={() => clearPart(activeCategory)}>
                  <Trash2 size={12} /> Clear
                </button>
              )}
            </div>
            <div style={styles.optionsList}>
              {options.map((part) => {
                const selected = activePart?.id === part.id;
                return (
                  <div key={part.id} style={{ ...styles.optionCard, ...(selected ? styles.optionCardSelected : {}) }}>
                    <div style={styles.optionMain} onClick={() => selectPart(activeCategory, part)}>
                      <div style={styles.optionName}>{part.name}</div>
                      <div style={styles.optionSpecs}>
                        {specLine(activeCategory, part)}
                      </div>
                    </div>
                    <div style={styles.optionRight}>
                      <div style={styles.optionPrice}>${part.price}</div>
                      <a
                        href={searchLink(part.name)}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.optionLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Find it <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI recommendations */}
        <div style={styles.aiPanel}>
          <div style={styles.aiPanelHeader}>
            <div style={styles.aiPanelTitle}><Sparkles size={15} color="var(--cyan)" /> Recommendations</div>
            <button style={styles.primaryBtnSmall} onClick={getAIRecommendations} disabled={aiLoading}>
              {aiLoading ? "Analyzing..." : "Analyze my build"}
            </button>
          </div>
          {aiError && <div style={styles.gateError}><AlertTriangle size={14} /> {aiError}</div>}
          {aiText && <div style={styles.aiText}>{aiText}</div>}
          {!aiText && !aiError && !aiLoading && (
            <div style={styles.aiEmpty}>Pick a few parts, then run an analysis for bottleneck checks and next-upgrade suggestions tailored to this build.</div>
          )}
        </div>

        <p style={styles.footerNote}>
          Prices are approximate references, not live retailer prices — check the linked search results for current pricing.
        </p>
      </div>
    </div>
  );
}

function specLine(category, part) {
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

function FontLoad() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
      * { box-sizing: border-box; }
      input:focus, button:focus { outline: 2px solid var(--cyan); outline-offset: 1px; }
      ::placeholder { color: #6b8577; }
    `}</style>
  );
}

/* ---------------------------------------------------------
   STYLES (PCB / schematic aesthetic)
--------------------------------------------------------- */
const vars = {
  "--bg": "#0a0a0b",
  "--panel": "#151417",
  "--panel2": "#0f0e10",
  "--border": "#2e2b2d",
  "--copper": "#e22f3a",
  "--cyan": "#ff6b6b",
  "--text": "#f2f0ee",
  "--muted": "#9a9498",
  "--danger": "#ffb020",
  "--success": "#5fd489",
};

const styles = {
  page: {
    ...vars,
    fontFamily: "'IBM Plex Sans', sans-serif",
    background: "var(--bg)",
    color: "var(--text)",
    minHeight: "100%",
    padding: "24px 16px",
    backgroundImage:
      "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
    backgroundSize: "28px 28px",
    backgroundPosition: "-1px -1px",
  },
  gateWrap: {
    maxWidth: 380,
    margin: "60px auto",
    background: "var(--panel)",
    border: "1px solid var(--border)",
    clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)",
    padding: 28,
    position: "relative",
  },
  gateHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 22 },
  brand: { fontSize: 18, fontWeight: 600, letterSpacing: 0.2 },
  brandSub: { fontSize: 11.5, color: "var(--muted)", fontFamily: "'IBM Plex Mono', monospace" },
  gateTabs: { display: "flex", gap: 6, marginBottom: 18, background: "var(--panel2)", padding: 4, border: "1px solid var(--border)" },
  gateTab: { flex: 1, padding: "8px 10px", background: "transparent", border: "none", color: "var(--muted)", fontFamily: "inherit", fontSize: 13, cursor: "pointer" },
  gateTabActive: { background: "var(--border)", color: "var(--text)" },
  gateForm: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, color: "var(--muted)", marginTop: 10, fontFamily: "'IBM Plex Mono', monospace" },
  input: {
    background: "var(--panel2)", border: "1px solid var(--border)", color: "var(--text)",
    padding: "10px 12px", fontSize: 14, fontFamily: "inherit",
  },
  primaryBtn: {
    marginTop: 18, background: "var(--copper)", color: "#fff", border: "none",
    padding: "11px 14px", fontSize: 14, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  },
  primaryBtnSmall: {
    background: "var(--copper)", color: "#fff", border: "none",
    padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
  },
  gateError: {
    display: "flex", alignItems: "center", gap: 6, color: "var(--danger)",
    fontSize: 12.5, marginTop: 10,
  },
  gateNote: { fontSize: 11.5, color: "var(--muted)", lineHeight: 1.5, marginTop: 16 },

  shell: { maxWidth: 980, margin: "0 auto" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  topBarLeft: { display: "flex", alignItems: "center", gap: 8 },
  topBarRight: { display: "flex", alignItems: "center", gap: 8 },
  userChip: {
    display: "flex", alignItems: "center", gap: 5, fontSize: 12,
    color: "var(--muted)", fontFamily: "'IBM Plex Mono', monospace",
    border: "1px solid var(--border)", padding: "5px 10px",
  },
  iconBtn: {
    background: "var(--panel)", border: "1px solid var(--border)", color: "var(--text)",
    padding: "6px 10px", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center",
  },

  hero: {
    display: "flex", alignItems: "stretch", gap: 0,
    background: "var(--panel)", border: "1px solid var(--border)", marginBottom: 16,
    clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)",
  },
  heroFigure: { flex: 1, padding: "18px 22px" },
  heroDivider: { width: 1, background: "var(--border)" },
  heroLabel: { fontSize: 11.5, color: "var(--muted)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 6 },
  heroNumber: { fontSize: 32, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", color: "var(--copper)" },
  heroNumberSmall: { fontSize: 24, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace" },
  heroSubtext: { fontSize: 11.5, color: "var(--muted)", marginTop: 4 },
  statusBadge: {
    display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 10px",
    fontSize: 12.5, fontFamily: "'IBM Plex Mono', monospace", border: "1px solid",
  },
  statusOk: { color: "var(--success)", borderColor: "var(--success)" },
  statusBad: { color: "var(--danger)", borderColor: "var(--danger)" },

  issuesPanel: {
    background: "#211b0f", border: "1px solid var(--danger)", padding: "10px 14px",
    marginBottom: 16, display: "flex", flexDirection: "column", gap: 6,
  },
  issueRow: { fontSize: 12.5, display: "flex", alignItems: "flex-start", gap: 7, color: "#f0d8b0" },

  mainGrid: { display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 },
  rail: { display: "flex", flexDirection: "column", gap: 6 },
  railItem: {
    display: "flex", alignItems: "center", gap: 10, textAlign: "left",
    background: "var(--panel)", border: "1px solid var(--border)", color: "var(--text)",
    padding: "10px 12px", cursor: "pointer", position: "relative",
  },
  railItemActive: { borderColor: "var(--cyan)", background: "var(--panel2)" },
  railText: { flex: 1, minWidth: 0 },
  railLabel: { fontSize: 13, fontWeight: 500 },
  railSub: { fontSize: 11, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  railDot: { width: 6, height: 6, borderRadius: "50%", background: "var(--success)" },

  optionsPanel: { background: "var(--panel)", border: "1px solid var(--border)" },
  optionsPanelHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 14px", borderBottom: "1px solid var(--border)", fontSize: 14, fontWeight: 500,
  },
  clearBtn: {
    display: "flex", alignItems: "center", gap: 5, background: "transparent",
    border: "1px solid var(--border)", color: "var(--muted)", fontSize: 11.5, padding: "4px 8px", cursor: "pointer",
  },
  optionsList: { display: "flex", flexDirection: "column" },
  optionCard: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 14px", borderBottom: "1px solid var(--border)", cursor: "pointer",
  },
  optionCardSelected: { background: "var(--panel2)", boxShadow: "inset 3px 0 0 var(--cyan)" },
  optionMain: { flex: 1 },
  optionName: { fontSize: 13.5, marginBottom: 3 },
  optionSpecs: { fontSize: 11.5, color: "var(--muted)", fontFamily: "'IBM Plex Mono', monospace" },
  optionRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 },
  optionPrice: { fontSize: 14, fontFamily: "'IBM Plex Mono', monospace", color: "var(--copper)" },
  optionLink: { fontSize: 11, color: "var(--cyan)", display: "flex", alignItems: "center", gap: 3, textDecoration: "none" },

  aiPanel: { background: "var(--panel)", border: "1px solid var(--border)", marginTop: 16, padding: 16 },
  aiPanelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  aiPanelTitle: { display: "flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 500 },
  aiText: { fontSize: 13, lineHeight: 1.6, color: "var(--text)", whiteSpace: "pre-wrap" },
  aiEmpty: { fontSize: 12.5, color: "var(--muted)" },

  footerNote: { fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 18 },

  gateCorner: {},
};
