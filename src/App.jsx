import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CircuitBoard, LogOut, User, LogIn } from "lucide-react";

import { CATEGORY_META, emptyBuild } from "./lib/catalog";
import { checkCompatibility } from "./lib/compatibility";
import { autoPickBuildForBudget } from "./lib/autoPicker";
import { fetchCurrentUser, fetchProfileData, saveProfileData, logout as authLogout } from "./lib/auth";
import { styles } from "./styles";
import { API_BASE } from "./lib/apiConfig";

import FontLoad from "./components/FontLoad";
import GlobalAnimations from "./components/GlobalAnimations";
import AuthModal from "./components/AuthModal";
import ModeTabs from "./components/ModeTabs";
import AutoPickerPanel from "./components/AutoPickerPanel";
import BuildHero from "./components/BuildHero";
import CategoryRail from "./components/CategoryRail";
import PartsPanel from "./components/PartsPanel";
import PerformancePanel from "./components/PerformancePanel";
import RecommendationsPanel from "./components/RecommendationsPanel";

/* ---------------------------------------------------------
   MAIN APP
   No forced login: the tool is usable immediately. A profile is
   only needed to persist a build across visits, so the sign-in
   modal only appears when the user actually tries to save while
   logged out -- not before they've done anything.
--------------------------------------------------------- */
export default function PCBuildTool() {
  const [activeUser, setActiveUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingSaveAfterAuth, setPendingSaveAfterAuth] = useState(false);

  const [build, setBuild] = useState(emptyBuild());
  const [activeCategory, setActiveCategory] = useState("cpu");

  const [aiLoading, setAiLoading] = useState(false);
  const [aiText, setAiText] = useState("");
  const [aiError, setAiError] = useState("");

  const [saveFlash, setSaveFlash] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [budgetInput, setBudgetInput] = useState("");
  const [useCase, setUseCase] = useState("gaming");
  const [autoPicking, setAutoPicking] = useState(false);
  const [autoPickError, setAutoPickError] = useState("");
  const [flashCategory, setFlashCategory] = useState(null);
  const [targetBudget, setTargetBudget] = useState(null);

  const [catalog, setCatalog] = useState(null);
  const [catalogError, setCatalogError] = useState("");

  const [mode, setMode] = useState("plan");
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
      .catch(() => setCatalogError("Couldn't load the parts catalog. Make sure the backend server is running."));
  }, []);

  useEffect(() => {
    fetchCurrentUser().then((username) => {
      if (username) {
        setActiveUser(username);
        fetchProfileData().then((data) => {
          if (data) {
            setBuild({ ...emptyBuild(), ...data.build });
            setCurrentPC({ ...emptyBuild(), ...data.currentPC });
          }
        });
      }
      setAuthChecked(true);
    });
  }, []);

  const compat = useMemo(() => checkCompatibility(activeBuild), [activeBuild]);
  const total = useMemo(
    () => Object.values(activeBuild).reduce((sum, p) => sum + (p ? p.price : 0), 0),
    [activeBuild]
  );

  const handleSaveBuild = useCallback(async () => {
    if (!activeUser) {
      setPendingSaveAfterAuth(true);
      setAuthModalOpen(true);
      return;
    }
    setSaveError("");
    try {
      await saveProfileData(build, currentPC);
      setSaveFlash(true);
      setTimeout(() => setSaveFlash(false), 1400);
    } catch (err) {
      setSaveError("Couldn't save. Try again in a moment.");
    }
  }, [activeUser, build, currentPC]);

  const handleAuthSuccess = async (username) => {
    setActiveUser(username);
    setAuthModalOpen(false);
    const data = await fetchProfileData();
    if (data && (Object.values(data.build).some(Boolean) || Object.values(data.currentPC).some(Boolean))) {
      setBuild({ ...emptyBuild(), ...data.build });
      setCurrentPC({ ...emptyBuild(), ...data.currentPC });
    }
    if (pendingSaveAfterAuth) {
      setPendingSaveAfterAuth(false);
      setTimeout(() => handleSaveBuild(), 0);
    }
  };

  const handleSignOut = async () => {
    await authLogout();
    setActiveUser(null);
    setBuild(emptyBuild());
    setCurrentPC(emptyBuild());
    setMode("plan");
    setAiText("");
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

  if (catalogError) {
    return (
      <div style={styles.page}>
        <FontLoad />
        <GlobalAnimations />
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
        <GlobalAnimations />
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
      <GlobalAnimations />
      {authModalOpen && (
        <AuthModal
          onSuccess={handleAuthSuccess}
          onClose={() => { setAuthModalOpen(false); setPendingSaveAfterAuth(false); }}
        />
      )}
      <div style={styles.shell}>
        <div style={styles.topBar}>
          <div style={styles.topBarLeft}>
            <CircuitBoard size={22} color="var(--copper)" strokeWidth={1.5} />
            <span style={styles.brand}>Bench</span>
          </div>
          <div style={styles.topBarRight}>
            {authChecked && activeUser ? (
              <>
                <span style={styles.userChip}><User size={13} /> {activeUser}</span>
                <button style={styles.iconBtn} onClick={handleSaveBuild} title="Save build">
                  {saveFlash ? "Saved" : "Save"}
                </button>
                <button style={styles.iconBtn} onClick={handleSignOut} title="Sign out">
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <button style={styles.iconBtn} onClick={handleSaveBuild} title="Save build">
                  {saveFlash ? "Saved" : "Save"}
                </button>
                <button style={styles.iconBtn} onClick={() => setAuthModalOpen(true)} title="Sign in">
                  <LogIn size={14} /> Sign in
                </button>
              </>
            )}
          </div>
        </div>
        {saveError && <div style={styles.gateError}>{saveError}</div>}

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

        <PerformancePanel build={activeBuild} />

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
