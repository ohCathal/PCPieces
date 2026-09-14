import { styles } from "../styles";
import { CATEGORY_META } from "../lib/catalog";

export default function CategoryRail({ activeBuild, activeCategory, setActiveCategory, flashCategory }) {
  return (
    <div style={styles.rail}>
      {CATEGORY_META.map(({ key, label, icon: Icon }) => {
        const filled = !!activeBuild[key];
        const justFilled = flashCategory === key;
        return (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            style={{
              ...styles.railItem,
              ...(activeCategory === key ? styles.railItemActive : {}),
              ...(justFilled ? { animation: "flashIn 0.75s ease-out" } : {}),
            }}
          >
            <Icon size={16} strokeWidth={1.6} />
            <div style={styles.railText}>
              <div style={styles.railLabel}>{label}</div>
              <div style={styles.railSub}>{filled ? activeBuild[key].name : "Not selected"}</div>
            </div>
            {filled && <span style={styles.railDot} />}
          </button>
        );
      })}
    </div>
  );
}
