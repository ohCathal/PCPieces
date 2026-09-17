/**
 * Plain inline style objects (what this app uses everywhere) can't express
 * :hover or @keyframes — those need real CSS. Rather than converting every
 * component to CSS classes, this injects one small global stylesheet once,
 * targeting element types that are already used consistently (every
 * clickable control in the app is a real <button> element), so hover
 * polish applies app-wide without touching other component files.
 */
export default function GlobalAnimations() {
  return (
    <style>{`
      @keyframes pcb-fade-in {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes pcb-spin {
        to { transform: rotate(360deg); }
      }

      button {
        transition: filter 0.15s ease, transform 0.1s ease, opacity 0.15s ease;
      }
      button:hover:not(:disabled) {
        filter: brightness(1.12);
      }
      button:active:not(:disabled) {
        transform: translateY(1px);
      }
      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      input:focus, select:focus {
        outline: none;
        border-color: var(--cyan) !important;
      }

      .pcb-spin {
        animation: pcb-spin 0.8s linear infinite;
        display: inline-block;
      }
    `}</style>
  );
}