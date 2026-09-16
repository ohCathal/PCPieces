import { useState, useMemo } from "react";
import { Trash2, ExternalLink, Search } from "lucide-react";
import { styles } from "../styles";
import { CATEGORY_META, searchLink, specLine } from "../lib/catalog";

const SORT_OPTIONS = [
  { key: "default", label: "Default order" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "name-asc", label: "Name: A to Z" },
];

export default function PartsPanel({ activeCategory, activePart, options, selectPart, clearPart }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("default");

  const [lastCategory, setLastCategory] = useState(activeCategory);
  if (activeCategory !== lastCategory) {
    setLastCategory(activeCategory);
    setSearchTerm("");
    setSortKey("default");
  }

  const filteredAndSorted = useMemo(() => {
    let result = options;
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((part) => part.name.toLowerCase().includes(term));
    }
    if (sortKey === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    else if (sortKey === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    else if (sortKey === "name-asc") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [options, searchTerm, sortKey]);

  const categoryLabel = CATEGORY_META.find((c) => c.key === activeCategory).label;

  return (
    <div style={styles.optionsPanel}>
      <div style={styles.optionsPanelHeader}>
        <span>{categoryLabel}</span>
        {activePart && (
          <button style={styles.clearBtn} onClick={() => clearPart(activeCategory)}>
            <Trash2 size={12} /> Remove
          </button>
        )}
      </div>

      <div style={searchRowStyle}>
        <div style={searchInputWrapStyle}>
          <Search size={13} color="var(--muted)" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${categoryLabel.toLowerCase()}...`}
            style={searchInputStyle}
          />
        </div>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} style={sortSelectStyle}>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div style={styles.optionsList}>
        {filteredAndSorted.length === 0 && (
          <div style={emptyStateStyle}>
            No {categoryLabel.toLowerCase()} match "{searchTerm}".
          </div>
        )}
        {filteredAndSorted.map((part) => {
          const isActive = activePart?.id === part.id;
          return (
            <div
              key={part.id}
              style={{ ...styles.optionCard, ...(isActive ? styles.optionCardActive : {}) }}
              onClick={() => selectPart(activeCategory, part)}
            >
              <div style={styles.optionMain}>
                <div style={styles.optionName}>{part.name}</div>
                <div style={styles.optionSpecs}>{specLine(activeCategory, part)}</div>
              </div>
              <div style={styles.optionRight}>
                <div style={styles.optionPrice}>${part.price}</div>
                
                 <a href={searchLink(part.name)}
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

const searchRowStyle = {
  display: "flex",
  gap: 8,
  padding: "10px 16px",
  borderBottom: "1px solid var(--border)",
};

const searchInputWrapStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  gap: 6,
  background: "var(--bg)",
  border: "1px solid var(--border)",
  padding: "6px 10px",
};

const searchInputStyle = {
  flex: 1,
  background: "transparent",
  border: "none",
  outline: "none",
  color: "var(--text)",
  fontSize: 13,
  fontFamily: "inherit",
};

const sortSelectStyle = {
  background: "var(--bg)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  fontSize: 12,
  padding: "6px 8px",
  fontFamily: "inherit",
};

const emptyStateStyle = {
  padding: "24px 16px",
  textAlign: "center",
  color: "var(--muted)",
  fontSize: 13,
};