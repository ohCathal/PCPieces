import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CircuitBoard, LogOut, User } from "lucide-react";

import { CATEGORY_META, emptyBuild } from "./lib/catalog";
import { checkCompatibility } from "./lib/compatibility";
import { autoPickBuildForBudget } from "./lib/autoPicker";
import { loadProfile, saveProfile, listProfiles } from "./lib/profileStorage";
import { styles } from "./styles";
import { API_BASE } from "./lib/apiConfig";

import FontLoad from "./components/FontLoad";
import ProfileGate from "./components/ProfileGate";
import ModeTabs from "./components/ModeTabs";
import AutoPickerPanel from "./components/AutoPickerPanel";
import BuildHero from "./components/BuildHero";
import CategoryRail from "./components/CategoryRail";
import PartsPanel from "./components/PartsPanel";
import RecommendationsPanel from "./components/RecommendationsPanel";

/* ---------------------------------------------------------
   MAIN APP
   This component owns all state and the handlers that touch
   more than one piece of it (profiles, save/load, the AI call).
   Everything else — rendering a single section of the screen —
   lives in its own file under src/components.
--------------------------------------------------------- */
export default function PCBuildTool() {
  const [stage, setStage] = useState("gate"); // gate | dashboard
  const [knownProfiles, setKnownProfiles] = useState([]);
  const [usernameInput, setUsernameInput] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [gateError, setGateError] = useState("");
  const [gateMode, setGateMode] = useState("select"); // select | create

  const [activeUser, setActiveUser] = useState(null);
  const [build, setBuild] = useState(emptyBuild());
  const [activeCategory, setActiveCategory] = useState("cpu");

  const [aiLoading, setAiLoading] = useState(false);
  const [aiText, setAiText] = useState("");
  const [aiError, setAiError] = useState("");

  const [saveFlash, setSaveFlash] = useState(false);

  const [budgetInput, setBudgetInput] = useState("");
  const [useCase, setUseCase] = useState("gaming");
  const [autoPicking, setAutoPicking] = useState(false);
  const [autoPickError, setAutoPickError] = useState("");
  const [flashCategory, setFlashCategory] = useState(null);
  const [targetBudget, setTargetBudget] = useState(null);

  const [catalog, setCatalog] = useState(null);
  const [catalogError, setCatalogError] = useState("");

  const [mode, setMode] = useState("plan"); // plan | current
  const [currentPC, setCurrentPC] = useState(emptyBuild());

  const activeBuild = mode === "plan" ? build : currentPC;
  const setActiveBuild = mode === "plan" ? setBuild : setCurrentPC;

  useEffect(() => {
    fetch(`${API_BASE}/api/parts`)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then(setCatalog)
      .catch(() => setCatalogError("Couldn't load the parts catalog. Make sure the backend server is running (npm run server)."));
  }, []);

  useEffect(() => {
    listProfiles().then(setKnownProfiles);
  }, []);

  const compat = useMemo(() => checkCompatibility(activeBuild), [activeBuild]);
  const total = useMemo(
    () => Object.values(activeBuild).reduce((sum, p) => sum + (p ? p.price : 0), 0),
    [activeBuild]
  );

  const handleCreateProfile = async () => {
    const name = usernameInput.trim();
    if (!name) { setGateError("Enter a profile name."); return; }
    if (pinInput.length < 4) { setGateError("PIN needs at least 4 digits."); return; }
    const existing = await loadProfile(name);
    if (existing) { setGateError("That profile already exists. Choose sign in instead."); return; }
    const data = { pin: pinInput, build: emptyBuild(), currentPC: emptyBuild() };
    await saveProfile(name, data);
    setActiveUser(name);
    setBuild(emptyBuild());
    setCurrentPC(emptyBuild());
    setStage("dashboard");
    setKnownProfiles((prev) => [...prev, name]);
  };

  const handleSignIn = async () => {
    const name = usernameInput.trim();
    if (!name) { setGateError("Enter a profile name."); return; }
    const data = await loadProfile(name);
    if (!data) { setGateError("No profile with that name yet. Switch to create one."); return; }
    if (data.pin !== pinInput) { setGateError("Incorrect PIN."); return; }
    setActiveUser(name);
    setBuild({ ...emptyBuild(), ...data.build });
    setCurrentPC({ ...emptyBuild(), ...(data.currentPC || {}) });
    setStage("dashboard");
  };

  const handleSaveBuild = useCallback(async () => {
    if (!activeUser) return;
    const data = await loadProfile(activeUser);
    await saveProfile(activeUser, { ...data, build, currentPC });
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1400);
  }, [activeUser, build, currentPC]);

  const handleSignOut = () => {
    setStage("gate");
    setActiveUser(null);
    setBuild(emptyBuild());
    setCurrentPC(emptyBuild());
    setMode("plan");
    setAiText("");
    setUsernameInput("");
    setPinInput("");
    setGateError("");
  };

  const selectPart = (category, part) => {
    setActiveBuild((prev) => ({ ...prev, [category]: part }));
  };

  const clearPart = (category) => {
    setActiveBuild((prev) => ({ ...prev, [category]: null }));
  };

  const handleAutoPick = () => {
    if (!catalog) return;
    const budget = parseFloat(budgetInput);
    if (!budget || budget < 300) {
      setAutoPickError("Enter a realistic budget — at least $300.");
      return;
    }
    setAutoPickError("");
    const picks = autoPickBuildForBudget(catalog, budget, useCase);
    setBuild(emptyBuild());
    setTargetBudget(budget);
    setAutoPicking(true);
    const order = CATEGORY_META.map((c) => c.key);
    order.forEach((key, i) => {
      setTimeout(() => {
        setBuild((prev) => ({ ...prev, [key]: picks[key] }));
        setFlashCategory(key);
        setTimeout(() => setFlashCategory((cur) => (cur === key ? null : cur)), 750);
        if (i === order.length - 1) setAutoPicking(false);
      }, i * 190);
    });
  };

  const getAIRecommendations = async () => {
    setAiLoading(true);
    setAiError("");
    setAiText("");
    const chosen = Object.entries(activeBuild).filter(([, v]) => v);
    if (chosen.length === 0) {
      setAiError("Pick at least one part first so there's something to analyze.");
      setAiLoading(false);
      return;
    }
    const summary = chosen.map(([cat, p]) => `${cat}: ${p.name} ($${p.price})`).join("\n");

    let ownedContext = "";
    if (mode === "plan") {
      const owned = Object.entries(currentPC).filter(([, v]) => v);
      if (owned.length > 0) {
        const ownedSummary = owned.map(([cat, p]) => `${cat}: ${p.name}`).join("\n");
        ownedContext = `\n\nFor context, here is what the user currently owns (their existing PC):\n${ownedSummary}\n\nWhere relevant, mention whether a planned part is a genuine upgrade over what they already have, or a sidegrade not worth the money.`;
      }
    }

    const label = mode === "plan" ? "a user's planned build" : "a user's current PC";
    const prompt = `You are a PC building assistant. Here is ${label}:\n${summary}\n\nTotal: $${total}. Estimated power draw: ${compat.estimatedDraw}W.\n${compat.issues.length ? `Known compatibility issues: ${compat.issues.join(" ")}` : "No compatibility issues detected so far."}${ownedContext}\n\nGive concise, practical recommendations: what to add next given what's missing, whether anything is a bottleneck or mismatched for the apparent use case (e.g. a strong GPU paired with a weak CPU), and one or two specific upgrade suggestions. Keep it under 150 words, plain text, no markdown headers.`;

    try {
      // Calls our own backend (server/index.js), which holds the Anthropic
      // API key and forwards the request — the browser never sees the key.
      const response = await fetch(`${API_BASE}/api/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error("Request failed");
      const data = await response.json();
      setAiText(data.text || "No response returned.");
    } catch (e) {
      setAiError("Couldn't reach the recommendation service. Make sure the backend server is running.");
    } finally {
      setAiLoading(false);
    }
  };

  /* ------------------- RENDER: GATE ------------------- */
  if (stage === "gate") {
    return (
      <ProfileGate
        gateMode={gateMode}
        setGateMode={setGateMode}
        usernameInput={usernameInput}
        setUsernameInput={setUsernameInput}
        pinInput={pinInput}
        setPinInput={setPinInput}
        gateError={gateError}
        setGateError={setGateError}
        knownProfiles={knownProfiles}
        handleSignIn={handleSignIn}
        handleCreateProfile={handleCreateProfile}
      />
    );
  }

  /* ------------------- RENDER: DASHBOARD ------------------- */
  if (catalogError) {
    return (
      <div style={styles.page}>
        <FontLoad />
        <div style={styles.gateWrap}>
          <div style={styles.gateError}>{catalogError}</div>
        </div>
      </div>
    );
  }
  if (!catalog) {
    return (
      <div style={styles.page}>
        <FontLoad />
        <div style={styles.gateWrap}>
          <div style={styles.brandSub}>Loading parts catalog...</div>
        </div>
      </div>
    );
  }

  const activePart = activeBuild[activeCategory];
  const options = catalog[activeCategory] || [];

  return (
    <div style={styles.page}>
      <FontLoad />
      <div style={styles.shell}>
        {/* Top bar */}
        <div style={styles.topBar}>
          <div style={styles.topBarLeft}>
            <CircuitBoard size={22} color="var(--copper)" strokeWidth={1.5} />
            <span style={styles.brand}>Bench</span>
          </div>
          <div style={styles.topBarRight}>
            <span style={styles.userChip}><User size={13} /> {activeUser}</span>
            <button style={styles.iconBtn} onClick={handleSaveBuild} title="Save build">
              {saveFlash ? "Saved" : "Save"}
            </button>
            <button style={styles.iconBtn} onClick={handleSignOut} title="Sign out">
              <LogOut size={14} />
            </button>
          </div>
        </div>

        <ModeTabs mode={mode} setMode={setMode} />

        {mode === "plan" && (
          <AutoPickerPanel
            budgetInput={budgetInput}
            setBudgetInput={setBudgetInput}
            useCase={useCase}
            setUseCase={setUseCase}
            handleAutoPick={handleAutoPick}
            autoPicking={autoPicking}
            autoPickError={autoPickError}
          />
        )}

        <BuildHero mode={mode} total={total} targetBudget={targetBudget} compat={compat} />

        <div style={styles.mainGrid}>
          <CategoryRail
            activeBuild={activeBuild}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            flashCategory={flashCategory}
          />
          <PartsPanel
            activeCategory={activeCategory}
            activePart={activePart}
            options={options}
            selectPart={selectPart}
            clearPart={clearPart}
          />
        </div>

        <RecommendationsPanel
          mode={mode}
          getAIRecommendations={getAIRecommendations}
          aiLoading={aiLoading}
          aiError={aiError}
          aiText={aiText}
        />

        <p style={styles.footerNote}>
          Prices are approximate references, not live retailer prices — check the linked search results for current pricing.
        </p>
      </div>
    </div>
  );
}
