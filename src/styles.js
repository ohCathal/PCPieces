/* ---------------------------------------------------------
   STYLES (PCB / schematic aesthetic)
   Centralized here so components can import just `styles`
   instead of every file carrying its own inline style object.
--------------------------------------------------------- */
export const vars = {
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

// Shared transition string so easing stays consistent everywhere it's used.
const EASE = "all 0.15s ease";

export const styles = {
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
    boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
    animation: "pcb-fade-in 0.25s ease",
  },
  gateHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 22 },
  brand: { fontSize: 18, fontWeight: 600, letterSpacing: 0.2 },
  brandSub: { fontSize: 11.5, color: "var(--muted)", fontFamily: "'IBM Plex Mono', monospace" },
  gateTabs: { display: "flex", gap: 6, marginBottom: 18, background: "var(--panel2)", padding: 4, border: "1px solid var(--border)" },
  gateTab: { flex: 1, padding: "8px 10px", background: "transparent", border: "none", color: "var(--muted)", fontFamily: "inherit", fontSize: 13, cursor: "pointer", transition: EASE },
  gateTabActive: { background: "var(--border)", color: "var(--text)" },
  gateForm: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, color: "var(--muted)", marginTop: 10, fontFamily: "'IBM Plex Mono', monospace" },
  input: {
    background: "var(--panel2)", border: "1px solid var(--border)", color: "var(--text)",
    padding: "10px 12px", fontSize: 14, fontFamily: "inherit", transition: EASE,
  },
  primaryBtn: {
    marginTop: 18, background: "var(--copper)", color: "#fff", border: "none",
    padding: "11px 14px", fontSize: 14, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    transition: EASE,
  },
  primaryBtnSmall: {
    background: "var(--copper)", color: "#fff", border: "none",
    padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: EASE,
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
    transition: EASE,
  },

  modeTabs: {
    display: "inline-flex", background: "var(--panel)", border: "1px solid var(--border)", marginBottom: 16,
  },
  modeTab: {
    padding: "9px 16px", background: "transparent", border: "none", color: "var(--muted)",
    fontFamily: "inherit", fontSize: 13, cursor: "pointer", transition: EASE,
  },
  modeTabActive: { background: "var(--copper)", color: "#fff" },

  autoPanel: {
    background: "var(--panel)", border: "1px solid var(--border)", marginBottom: 16,
    padding: "14px 16px", animation: "pcb-fade-in 0.25s ease",
  },
  autoPanelHeader: {
    display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 500, marginBottom: 12,
  },
  autoPanelRow: { display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" },
  autoField: { display: "flex", flexDirection: "column", gap: 6 },
  budgetInputWrap: { display: "flex", alignItems: "center", background: "var(--panel2)", border: "1px solid var(--border)", transition: EASE },
  budgetPrefix: { padding: "0 0 0 10px", color: "var(--muted)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 14 },
  budgetInput: {
    background: "transparent", border: "none", color: "var(--text)", padding: "9px 10px 9px 4px",
    fontSize: 14, fontFamily: "'IBM Plex Mono', monospace", width: 100,
  },
  segmented: { display: "flex", background: "var(--panel2)", border: "1px solid var(--border)" },
  segmentedBtn: {
    padding: "9px 12px", background: "transparent", border: "none", color: "var(--muted)",
    fontFamily: "inherit", fontSize: 12.5, cursor: "pointer", whiteSpace: "nowrap", transition: EASE,
  },
  segmentedBtnActive: { background: "var(--copper)", color: "#fff" },

  hero: {
    display: "flex", alignItems: "stretch", gap: 0,
    background: "var(--panel)", border: "1px solid var(--border)", marginBottom: 16,
    clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)",
    boxShadow: "0 8px 28px rgba(0,0,0,0.28)",
    animation: "pcb-fade-in 0.25s ease",
  },
  heroFigure: { flex: 1, padding: "18px 22px" },
  heroDivider: { width: 1, background: "var(--border)" },
  heroLabel: { fontSize: 11.5, color: "var(--muted)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 6 },
  heroNumber: { fontSize: 32, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", color: "var(--copper)", transition: EASE },
  heroNumberSmall: { fontSize: 24, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace" },
  heroSubtext: { fontSize: 11.5, color: "var(--muted)", marginTop: 4 },
  statusBadge: {
    display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 10px",
    fontSize: 12.5, fontFamily: "'IBM Plex Mono', monospace", border: "1px solid", transition: EASE,
  },
  statusOk: { color: "var(--success)", borderColor: "var(--success)" },
  statusBad: { color: "var(--danger)", borderColor: "var(--danger)" },

  issuesPanel: {
    background: "#211b0f", border: "1px solid var(--danger)", padding: "10px 14px",
    marginBottom: 16, display: "flex", flexDirection: "column", gap: 6,
    animation: "pcb-fade-in 0.2s ease",
  },
  issueRow: { fontSize: 12.5, display: "flex", alignItems: "flex-start", gap: 7, color: "#f0d8b0" },

  mainGrid: { display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 },
  rail: { display: "flex", flexDirection: "column", gap: 6 },
  railItem: {
    display: "flex", alignItems: "center", gap: 10, textAlign: "left",
    background: "var(--panel)", border: "1px solid var(--border)", color: "var(--text)",
    padding: "10px 12px", cursor: "pointer", position: "relative", transition: EASE,
  },
  railItemActive: { borderColor: "var(--cyan)", background: "var(--panel2)" },
  railText: { flex: 1, minWidth: 0 },
  railLabel: { fontSize: 13, fontWeight: 500 },
  railSub: { fontSize: 11, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  railDot: { width: 6, height: 6, borderRadius: "50%", background: "var(--success)" },

  optionsPanel: { background: "var(--panel)", border: "1px solid var(--border)", animation: "pcb-fade-in 0.2s ease" },
  optionsPanelHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 14px", borderBottom: "1px solid var(--border)", fontSize: 14, fontWeight: 500,
  },
  clearBtn: {
    display: "flex", alignItems: "center", gap: 5, background: "transparent",
    border: "1px solid var(--border)", color: "var(--muted)", fontSize: 11.5, padding: "4px 8px", cursor: "pointer",
    transition: EASE,
  },
  optionsList: { display: "flex", flexDirection: "column" },
  optionCard: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 14px", borderBottom: "1px solid var(--border)", cursor: "pointer", transition: EASE,
  },
  optionCardActive: { background: "var(--panel2)", boxShadow: "inset 3px 0 0 var(--cyan)" },
  optionMain: { flex: 1 },
  optionName: { fontSize: 13.5, marginBottom: 3 },
  optionSpecs: { fontSize: 11.5, color: "var(--muted)", fontFamily: "'IBM Plex Mono', monospace" },
  optionRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 },
  optionPrice: { fontSize: 14, fontFamily: "'IBM Plex Mono', monospace", color: "var(--copper)" },
  optionLink: { fontSize: 11, color: "var(--cyan)", display: "flex", alignItems: "center", gap: 3, textDecoration: "none", transition: EASE },

  aiPanel: { background: "var(--panel)", border: "1px solid var(--border)", marginTop: 16, padding: 16, animation: "pcb-fade-in 0.2s ease" },
  aiPanelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  aiPanelTitle: { display: "flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 500 },
  aiText: { fontSize: 13, lineHeight: 1.6, color: "var(--text)", whiteSpace: "pre-wrap" },
  aiEmpty: { fontSize: 12.5, color: "var(--muted)" },

  footerNote: { fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 18 },

  gateCorner: {},
};
