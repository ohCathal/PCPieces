import { CircuitBoard, Lock, AlertTriangle } from "lucide-react";
import { styles } from "../styles";
import FontLoad from "./FontLoad";

export default function ProfileGate({
  gateMode,
  setGateMode,
  usernameInput,
  setUsernameInput,
  pinInput,
  setPinInput,
  gateError,
  setGateError,
  knownProfiles,
  handleSignIn,
  handleCreateProfile,
}) {
  return (
    <div style={styles.page}>
      <FontLoad />
      <div style={styles.gateWrap}>
        <div style={styles.gateCorner} />
        <div style={styles.gateHeader}>
          <CircuitBoard size={28} color="var(--copper)" strokeWidth={1.5} />
          <div>
            <div style={styles.brand}>Bench</div>
            <div style={styles.brandSub}>build planner</div>
          </div>
        </div>

        <div style={styles.gateTabs}>
          <button
            onClick={() => { setGateMode("select"); setGateError(""); }}
            style={{ ...styles.gateTab, ...(gateMode === "select" ? styles.gateTabActive : {}) }}
          >
            Sign in
          </button>
          <button
            onClick={() => { setGateMode("create"); setGateError(""); }}
            style={{ ...styles.gateTab, ...(gateMode === "create" ? styles.gateTabActive : {}) }}
          >
            New profile
          </button>
        </div>

        <div style={styles.gateForm}>
          <label style={styles.label}>Profile name</label>
          <input
            style={styles.input}
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="e.g. jordan"
            list="known-profiles"
          />
          <datalist id="known-profiles">
            {knownProfiles.map((p) => <option key={p} value={p} />)}
          </datalist>

          <label style={styles.label}>PIN</label>
          <input
            style={styles.input}
            type="password"
            inputMode="numeric"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="4+ digits"
            onKeyDown={(e) => e.key === "Enter" && (gateMode === "select" ? handleSignIn() : handleCreateProfile())}
          />

          {gateError && <div style={styles.gateError}><AlertTriangle size={14} /> {gateError}</div>}

          <button style={styles.primaryBtn} onClick={gateMode === "select" ? handleSignIn : handleCreateProfile}>
            <Lock size={15} /> {gateMode === "select" ? "Sign in" : "Create profile & continue"}
          </button>

          <p style={styles.gateNote}>
            This PIN keeps your saved build separate from other profiles on this device. It's stored locally to your account,
            not encrypted authentication — don't reuse a real password here.
          </p>
        </div>
      </div>
    </div>
  );
}
