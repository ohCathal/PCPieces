import { useState } from "react";
import { X, LogIn, UserPlus, AlertTriangle, MailCheck } from "lucide-react";
import { styles } from "../styles";
import { login, register, resendVerification } from "../lib/auth";

export default function AuthModal({ onSuccess, onClose }) {
  const [mode, setMode] = useState("login"); // login | create | check-email
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState("");

  const handleSubmit = async () => {
    setError("");
    setNeedsVerification(false);
    setResendStatus("");
    if (!email.trim()) { setError("Enter your email."); return; }
    if (!password || password.length < 8) { setError("Password needs at least 8 characters."); return; }

    setLoading(true);
    try {
      if (mode === "login") {
        const signedInEmail = await login(email.trim(), password);
        onSuccess(signedInEmail);
      } else {
        await register(email.trim(), password);
        setMode("check-email");
      }
    } catch (err) {
      setError(err.message);
      if (err.message.toLowerCase().includes("verify")) setNeedsVerification(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendStatus("");
    try {
      await resendVerification(email.trim());
      setResendStatus("Sent — check your inbox again.");
    } catch (err) {
      setResendStatus(err.message);
    }
  };

  if (mode === "check-email") {
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={{ ...styles.gateWrap, margin: 0 }} onClick={(e) => e.stopPropagation()}>
          <button style={closeBtnStyle} onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
          <div style={styles.gateHeader}>
            <MailCheck size={20} color="var(--success)" />
            <span style={styles.brand}>Check your email</span>
          </div>
          <p style={styles.gateNote}>
            We sent a verification link to <strong>{email.trim()}</strong>. Click it, then come back
            here and sign in.
          </p>
          <button style={styles.primaryBtn} onClick={() => setMode("login")}>
            <LogIn size={15} /> I've verified — sign in
          </button>
          <p style={{ ...styles.gateNote, marginTop: 10 }}>
            Didn't get it?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); handleResend(); }} style={{ color: "var(--cyan)" }}>
              Resend the email
            </a>
            {resendStatus && <span style={{ display: "block", marginTop: 4 }}>{resendStatus}</span>}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={{ ...styles.gateWrap, margin: 0 }} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtnStyle} onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
        <div style={styles.gateHeader}>
          <span style={styles.brand}>{mode === "login" ? "Sign in to save" : "Create an account"}</span>
        </div>
        <div style={styles.gateTabs}>
          <button
            style={{ ...styles.gateTab, ...(mode === "login" ? styles.gateTabActive : {}) }}
            onClick={() => { setMode("login"); setError(""); setNeedsVerification(false); }}
          >
            Sign in
          </button>
          <button
            style={{ ...styles.gateTab, ...(mode === "create" ? styles.gateTabActive : {}) }}
            onClick={() => { setMode("create"); setError(""); setNeedsVerification(false); }}
          >
            Create account
          </button>
        </div>
        <div style={styles.gateForm}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
          {error && (
            <div style={styles.gateError}>
              <AlertTriangle size={14} /> {error}
            </div>
          )}
          {needsVerification && (
            <p style={{ ...styles.gateNote, marginTop: -4 }}>
              <a href="#" onClick={(e) => { e.preventDefault(); handleResend(); }} style={{ color: "var(--cyan)" }}>
                Resend verification email
              </a>
              {resendStatus && <span style={{ display: "block", marginTop: 4 }}>{resendStatus}</span>}
            </p>
          )}
          <button style={styles.primaryBtn} onClick={handleSubmit} disabled={loading}>
            {mode === "login" ? <LogIn size={15} /> : <UserPlus size={15} />}
            {loading ? "Working..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </div>
        <p style={styles.gateNote}>
          You don't need an account to build or browse — this is only for saving your build so you can come back to it later.
        </p>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100,
  animation: "pcb-fade-in 0.15s ease",
};

const closeBtnStyle = {
  position: "absolute",
  top: 12,
  right: 12,
  background: "transparent",
  border: "none",
  color: "var(--muted)",
  cursor: "pointer",
  padding: 4,
};