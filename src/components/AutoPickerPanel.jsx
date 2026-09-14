import { Sparkles, AlertTriangle } from "lucide-react";
import { styles } from "../styles";
import { USE_CASES } from "../lib/autoPicker";

export default function AutoPickerPanel({
  budgetInput,
  setBudgetInput,
  useCase,
  setUseCase,
  handleAutoPick,
  autoPicking,
  autoPickError,
}) {
  return (
    <div style={styles.autoPanel}>
      <div style={styles.autoPanelHeader}>
        <Sparkles size={15} color="var(--copper)" />
        <span>Build me something</span>
      </div>
      <div style={styles.autoPanelRow}>
        <div style={styles.autoField}>
          <label style={styles.label}>Budget</label>
          <div style={styles.budgetInputWrap}>
            <span style={styles.budgetPrefix}>$</span>
            <input
              style={styles.budgetInput}
              type="number"
              min="300"
              step="50"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="1500"
            />
          </div>
        </div>
        <div style={styles.autoField}>
          <label style={styles.label}>Use case</label>
          <div style={styles.segmented}>
            {Object.entries(USE_CASES).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setUseCase(key)}
                style={{ ...styles.segmentedBtn, ...(useCase === key ? styles.segmentedBtnActive : {}) }}
              >
                {cfg.label}
              </button>
            ))}
          </div>
        </div>
        <button style={styles.primaryBtnSmall} onClick={handleAutoPick} disabled={autoPicking}>
          {autoPicking ? "Building..." : "Generate build"}
        </button>
      </div>
      {autoPickError && <div style={styles.gateError}><AlertTriangle size={14} /> {autoPickError}</div>}
    </div>
  );
}
