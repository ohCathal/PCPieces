import { CheckCircle2, AlertTriangle } from "lucide-react";
import { styles } from "../styles";

export default function BuildHero({ mode, total, targetBudget, compat }) {
  const noIssues = compat.issues.length === 0;

  return (
    <>
      <div style={styles.hero}>
        <div style={styles.heroFigure}>
          <div style={styles.heroLabel}>{mode === "plan" ? "Build total" : "Current PC value"}</div>
          <div style={styles.heroNumber}>${total.toLocaleString()}</div>
          {mode === "plan" && targetBudget != null && (
            <div style={{ ...styles.heroSubtext, color: total <= targetBudget ? "var(--success)" : "var(--danger)" }}>
              {total <= targetBudget
                ? `$${(targetBudget - total).toLocaleString()} under your $${targetBudget.toLocaleString()} budget`
                : `$${(total - targetBudget).toLocaleString()} over your $${targetBudget.toLocaleString()} budget`}
            </div>
          )}
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
    </>
  );
}
