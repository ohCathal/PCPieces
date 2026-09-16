import { Gamepad2, Cpu, AlertTriangle } from "lucide-react";
import { estimatePerformance, GAMES_BY_CATEGORY } from "../lib/benchmarkEstimates";

export default function PerformancePanel({ build }) {
  const estimate = estimatePerformance(build.cpu, build.gpu);

  if (!estimate) {
    return (
      <div style={panelStyle}>
        <div style={headerStyle}>
          <Gamepad2 size={15} color="var(--copper)" />
          <span>Performance estimate</span>
        </div>
        <div style={emptyStyle}>Pick a CPU and a graphics card to see estimated performance.</div>
      </div>
    );
  }

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <Gamepad2 size={15} color="var(--copper)" />
        <span>Performance estimate</span>
      </div>

      <div style={disclaimerStyle}>
        Estimated from published tier-level benchmarks, not a measured test of this exact build.
      </div>

      {estimate.bottleneck && (
        <div style={bottleneckStyle}>
          <AlertTriangle size={13} />
          This CPU may hold back your GPU at lower resolutions — consider a stronger CPU to get
          the most out of it, especially in CPU-heavy or esports titles.
        </div>
      )}

      <div style={sectionLabelStyle}>Gaming — {estimate.gpuTier} class</div>
      <div style={gameGridStyle}>
        {[...GAMES_BY_CATEGORY.esports, ...GAMES_BY_CATEGORY.aaa].map((game) => {
          const range = estimate.games[game];
          if (!range) return null;
          return (
            <div key={game} style={gameRowStyle}>
              <span style={gameNameStyle}>{game}</span>
              <span style={gameFpsStyle}>{range[0]}–{range[1]} FPS</span>
            </div>
          );
        })}
      </div>

      <div style={sectionLabelStyle}><Cpu size={12} /> Workstation</div>
      <div style={workstationRowStyle}>
        <span style={gameNameStyle}>Blender (Cycles) benchmark score</span>
        <span style={gameFpsStyle}>~{estimate.blenderScoreRange[0].toLocaleString()}–{estimate.blenderScoreRange[1].toLocaleString()}</span>
      </div>
      <div style={anchorNoteStyle}>({estimate.blenderAnchor})</div>
      <div style={workstationNoteStyle}>{estimate.workstationNote}</div>
    </div>
  );
}

const panelStyle = { background: "var(--panel)", border: "1px solid var(--border)", marginTop: 16 };
const headerStyle = {
  display: "flex", alignItems: "center", gap: 8, padding: "12px 16px",
  borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 13,
};
const emptyStyle = { padding: "20px 16px", color: "var(--muted)", fontSize: 13 };
const disclaimerStyle = {
  padding: "8px 16px", fontSize: 11.5, color: "var(--muted)",
  fontStyle: "italic", borderBottom: "1px solid var(--border)",
};
const bottleneckStyle = {
  display: "flex", gap: 8, alignItems: "flex-start", padding: "10px 16px",
  fontSize: 12.5, color: "var(--danger)", borderBottom: "1px solid var(--border)",
};
const sectionLabelStyle = {
  display: "flex", alignItems: "center", gap: 6, padding: "10px 16px 4px",
  fontSize: 11, color: "var(--muted)", fontFamily: "'IBM Plex Mono', monospace",
  textTransform: "uppercase", letterSpacing: 0.5,
};
const gameGridStyle = { padding: "0 16px 8px" };
const gameRowStyle = {
  display: "flex", justifyContent: "space-between", padding: "6px 0",
  borderBottom: "1px solid var(--border)", fontSize: 13,
};
const gameNameStyle = { color: "var(--text)" };
const gameFpsStyle = { color: "var(--copper)", fontFamily: "'IBM Plex Mono', monospace" };
const workstationRowStyle = {
  display: "flex", justifyContent: "space-between", padding: "6px 16px", fontSize: 13,
};
const anchorNoteStyle = { padding: "0 16px 8px", fontSize: 11.5, color: "var(--muted)" };
const workstationNoteStyle = {
  padding: "8px 16px 16px", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5,
};