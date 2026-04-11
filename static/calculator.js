const dom = {
  heading: document.getElementById("calculatorHeading"),
  error: document.getElementById("calculatorError"),
  content: document.getElementById("calculatorContent"),
  eventInfo: document.getElementById("calculatorEventInfo"),
  eventText: document.getElementById("calculatorEvent"),
  marketText: document.getElementById("calculatorMarket"),
  arbOriginal: document.getElementById("arbOriginal"),
  arbCurrent: document.getElementById("arbCurrent"),
  oddsABook: document.getElementById("oddsABook"),
  oddsBBook: document.getElementById("oddsBBook"),
  oddsA: document.getElementById("oddsA"),
  oddsB: document.getElementById("oddsB"),
  resetOdds: document.getElementById("resetOdds"),
  amountABook: document.getElementById("amountABook"),
  amountBBook: document.getElementById("amountBBook"),
  amountA: document.getElementById("amountA"),
  amountB: document.getElementById("amountB"),
  validation: document.getElementById("calculatorValidation"),
  status: document.getElementById("calculatorStatus"),
};

const state = {
  config: null,
  lastStakeSource: null,
};

function parsePositiveAmount(rawValue) {
  const text = String(rawValue ?? "").trim();
  if (!text) {
    return null;
  }
  const value = Number(text);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return value;
}

function parseRequiredText(params, key) {
  const value = (params.get(key) || "").trim();
  return value || null;
}

function parseRequiredOdds(params, key) {
  const value = Number(params.get(key));
  if (!Number.isFinite(value) || value <= 1) {
    return null;
  }
  return value;
}

function parseOptionalFloat(params, key) {
  const raw = (params.get(key) || "").trim();
  if (!raw) {
    return null;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function roundEquivalentStake(value) {
  if (!Number.isFinite(value)) {
    return null;
  }
  return Math.round(value);
}

function computeArbPercent(oddsA, oddsB) {
  if (!Number.isFinite(oddsA) || !Number.isFinite(oddsB) || oddsA <= 1 || oddsB <= 1) {
    return null;
  }
  return (1 / oddsA + 1 / oddsB - 1) * -100;
}

function formatArbBadge(arbPercent) {
  if (arbPercent === null) {
    return { text: "—", className: "" };
  }
  if (arbPercent <= 0) {
    return { text: "No arb", className: "calculator-arb-negative" };
  }
  return { text: `${arbPercent.toFixed(2)}%`, className: "calculator-arb-positive" };
}

function showInvalidLink(message) {
  dom.error.hidden = false;
  dom.error.textContent = message;
  dom.content.hidden = true;
}

function clearCalculatedField(targetInput, message) {
  targetInput.value = "";
  dom.validation.textContent = message || "";
}

function renderConfig(config) {
  dom.error.hidden = true;
  dom.content.hidden = false;

  const labelA = `${config.bookA} | ${config.labelA}`;
  const labelB = `${config.bookB} | ${config.labelB}`;
  dom.oddsABook.textContent = labelA;
  dom.oddsBBook.textContent = labelB;
  dom.amountABook.textContent = labelA;
  dom.amountBBook.textContent = labelB;
  dom.oddsA.value = config.oddsA;
  dom.oddsB.value = config.oddsB;
  dom.status.textContent = `Type on ${config.bookA} or ${config.bookB} to size the opposite leg.`;
  dom.validation.textContent = "";

  if (config.eventText || config.marketHint) {
    dom.eventInfo.hidden = false;
    dom.eventText.textContent = config.eventText || "";
    dom.marketText.textContent = config.marketHint || "";
  }

  const original = formatArbBadge(config.originalArb);
  dom.arbOriginal.textContent = original.text;
  dom.arbOriginal.className = `calculator-arb-badge ${original.className}`;

  updateCurrentArb();
}

function readConfig() {
  const params = new URLSearchParams(window.location.search);
  const config = {
    bookA: parseRequiredText(params, "ab"),
    labelA: parseRequiredText(params, "al"),
    oddsA: parseRequiredOdds(params, "ao"),
    bookB: parseRequiredText(params, "bb"),
    labelB: parseRequiredText(params, "bl"),
    oddsB: parseRequiredOdds(params, "bo"),
    eventText: parseRequiredText(params, "e"),
    marketHint: parseRequiredText(params, "m"),
    originalArb: parseOptionalFloat(params, "arb"),
  };

  if (!config.bookA || !config.labelA || !config.oddsA || !config.bookB || !config.labelB || !config.oddsB) {
    return null;
  }
  return config;
}

function parseOddsInput(value) {
  const num = Number(value);
  return Number.isFinite(num) && num > 1 ? num : null;
}

function updateCurrentArb() {
  const oddsA = parseOddsInput(dom.oddsA.value);
  const oddsB = parseOddsInput(dom.oddsB.value);
  const arbPercent = computeArbPercent(oddsA, oddsB);
  const badge = formatArbBadge(arbPercent);
  dom.arbCurrent.textContent = badge.text;
  dom.arbCurrent.className = `calculator-arb-badge ${badge.className}`;

  const oddsChanged = state.config && (
    Number(dom.oddsA.value) !== state.config.oddsA ||
    Number(dom.oddsB.value) !== state.config.oddsB
  );
  dom.resetOdds.style.display = oddsChanged ? "" : "none";
}

function applyCalculation(source) {
  if (!state.config) {
    return;
  }

  const sourceInput = source === "a" ? dom.amountA : dom.amountB;
  const targetInput = source === "a" ? dom.amountB : dom.amountA;
  const sourceAmount = parsePositiveAmount(sourceInput.value);
  if (sourceAmount === null) {
    clearCalculatedField(targetInput, sourceInput.value.trim() ? "Enter an amount greater than 0.00." : "");
    return;
  }

  const oddsA = Number(dom.oddsA.value);
  const oddsB = Number(dom.oddsB.value);
  if (!Number.isFinite(oddsA) || oddsA <= 1 || !Number.isFinite(oddsB) || oddsB <= 1) {
    clearCalculatedField(targetInput, "Enter valid odds (greater than 1.00) on both sides.");
    return;
  }

  const exactEquivalent = source === "a" ? (sourceAmount * oddsA) / oddsB : (sourceAmount * oddsB) / oddsA;
  const roundedEquivalent = roundEquivalentStake(exactEquivalent);
  targetInput.value = roundedEquivalent === null ? "" : String(roundedEquivalent);
  dom.validation.textContent = "";
}

function onOddsChanged() {
  updateCurrentArb();
  if (state.lastStakeSource) {
    applyCalculation(state.lastStakeSource);
  }
}

function resetToAlertOdds() {
  if (!state.config) {
    return;
  }
  dom.oddsA.value = state.config.oddsA;
  dom.oddsB.value = state.config.oddsB;
  onOddsChanged();
}

function attachInputHandlers() {
  dom.amountA.addEventListener("input", () => {
    state.lastStakeSource = "a";
    applyCalculation("a");
  });
  dom.amountB.addEventListener("input", () => {
    state.lastStakeSource = "b";
    applyCalculation("b");
  });
  dom.oddsA.addEventListener("input", onOddsChanged);
  dom.oddsB.addEventListener("input", onOddsChanged);
  dom.resetOdds.addEventListener("click", resetToAlertOdds);
}

function init() {
  state.config = readConfig();
  if (!state.config) {
    showInvalidLink("Invalid calculator link. Open this page from a fresh Telegram alert.");
    return;
  }

  renderConfig(state.config);
  attachInputHandlers();
}

init();
