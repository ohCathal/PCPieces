import { API_BASE } from "./apiConfig";

const TOKEN_KEY = "bench_auth_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Registering does NOT log you in -- the backend sends a real verification
// email and blocks login until that link is clicked. Returns the backend's
// confirmation message; throws on error (bad email, weak password, etc.)
export async function register(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not create account.");
  return data.message;
}

export async function resendVerification(email) {
  const res = await fetch(`${API_BASE}/api/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not resend verification email.");
  return data.message;
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not sign in.");
  setToken(data.token);
  return data.email;
}

export async function fetchCurrentUser() {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) { clearToken(); return null; }
    const data = await res.json();
    return data.email;
  } catch {
    return null;
  }
}

export async function logout() {
  const token = getToken();
  if (token) {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
  clearToken();
}

export async function saveProfileData(build, currentPC) {
  const token = getToken();
  if (!token) throw new Error("Not signed in.");
  const res = await fetch(`${API_BASE}/api/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ build, currentPC }),
  });
  if (!res.ok) throw new Error("Could not save.");
}

export async function fetchProfileData() {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_BASE}/api/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}