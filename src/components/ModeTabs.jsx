import { styles } from "../styles";

export default function ModeTabs({ mode, setMode }) {
  return (
    <div style={styles.modeTabs}>
      <button
        onClick={() => setMode("plan")}
        style={{ ...styles.modeTab, ...(mode === "plan" ? styles.modeTabActive : {}) }}
      >
        Plan a build
      </button>
      <button
        onClick={() => setMode("current")}
        style={{ ...styles.modeTab, ...(mode === "current" ? styles.modeTabActive : {}) }}
      >
        My current PC
      </button>
    </div>
  );
}
