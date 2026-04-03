const dom = {
  error: document.getElementById("calculatorError"),
  content: document.getElementById("calculatorContent"),
  amountABook: document.getElementById("amountABook"),
  amountBBook: document.getElementById("amountBBook"),
  amountA: document.getElementById("amountA"),
  amountB: document.getElementById("amountB"),
  validation: document.getElementById("calculatorValidation"),
  status: document.getElementById("calculatorStatus"),
};

const state = {
  config: null,
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

function roundEquivalentStake(value) {
  if (!Number.isFinite(value)) {
    return null;
  }
  return Math.round(value);
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
  dom.amountABook.textContent = `${config.bookA} | ${config.labelA}`;
  dom.amountBBook.textContent = `${config.bookB} | ${config.labelB}`;
  dom.status.textContent = `Type on ${config.bookA} or ${config.bookB} to size the opposite leg.`;
  dom.validation.textContent = "";
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
  };

  if (!config.bookA || !config.labelA || !config.oddsA || !config.bookB || !config.labelB || !config.oddsB) {
    return null;
  }
  return config;
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

  const oddsA = state.config.oddsA;
  const oddsB = state.config.oddsB;
  const exactEquivalent = source === "a" ? (sourceAmount * oddsA) / oddsB : (sourceAmount * oddsB) / oddsA;
  const roundedEquivalent = roundEquivalentStake(exactEquivalent);
  targetInput.value = roundedEquivalent === null ? "" : String(roundedEquivalent);
  dom.validation.textContent = "";
}

function attachInputHandlers() {
  dom.amountA.addEventListener("input", () => {
    applyCalculation("a");
  });
  dom.amountB.addEventListener("input", () => {
    applyCalculation("b");
  });
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
