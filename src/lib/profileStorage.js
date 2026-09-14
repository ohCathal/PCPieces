/**
 * Profile persistence, backed by localStorage — so profiles live only
 * in this browser on this device. Swap these three functions for real
 * API calls to a backend + database if you want profiles to follow a
 * person across devices.
 */
export async function loadProfile(username) {
  try {
    const raw = localStorage.getItem(`profile:${username}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveProfile(username, data) {
  try {
    localStorage.setItem(`profile:${username}`, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export async function listProfiles() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("profile:")) keys.push(key.replace("profile:", ""));
    }
    return keys;
  } catch {
    return [];
  }
}
