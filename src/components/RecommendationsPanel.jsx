import { Sparkles, AlertTriangle } from "lucide-react";
import { styles } from "../styles";

export default function RecommendationsPanel({ mode, getAIRecommendations, aiLoading, aiError, aiText }) {
  return (
    <div style={styles.aiPanel}>
      <div style={styles.aiPanelHeader}>
        <div style={styles.aiPanelTitle}><Sparkles size={15} color="var(--cyan)" /> Recommendations</div>
        <button style={styles.primaryBtnSmall} onClick={getAIRecommendations} disabled={aiLoading}>
          {aiLoading ? "Analyzing..." : mode === "plan" ? "Analyze my build" : "Analyze my PC"}
        </button>
      </div>
      {aiError && <div style={styles.gateError}><AlertTriangle size={14} /> {aiError}</div>}
      {aiText && <div style={styles.aiText}>{aiText}</div>}
      {!aiText && !aiError && !aiLoading && (
        <div style={styles.aiEmpty}>
          {mode === "plan"
            ? 'Pick a few parts, then run an analysis for bottleneck checks and next-upgrade suggestions. If you\'ve filled in "My current PC" too, it\'ll factor that in for upgrade advice.'
            : "Fill in what your PC currently has, then run an analysis for bottleneck checks and upgrade suggestions."}
        </div>
      )}
    </div>
  );
}
