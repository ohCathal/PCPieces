export default function FontLoad() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
      * { box-sizing: border-box; }
      input:focus, button:focus { outline: 2px solid var(--cyan); outline-offset: 1px; }
      ::placeholder { color: #6b8577; }
      @keyframes flashIn {
        0% { box-shadow: 0 0 0 0 rgba(226,47,58,0.55); border-color: var(--copper); background: var(--panel2); }
        100% { box-shadow: 0 0 0 14px rgba(226,47,58,0); border-color: var(--border); }
      }
    `}</style>
  );
}
