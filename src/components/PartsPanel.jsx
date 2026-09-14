import { Trash2, ExternalLink } from "lucide-react";
import { styles } from "../styles";
import { CATEGORY_META, searchLink, specLine } from "../lib/catalog";

export default function PartsPanel({ activeCategory, activePart, options, selectPart, clearPart }) {
  return (
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
                <div style={styles.optionSpecs}>{specLine(activeCategory, part)}</div>
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
  );
}
