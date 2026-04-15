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
  oddsAAmerican: document.getElementById("oddsAAmerican"),
  oddsBAmerican: document.getElementById("oddsBAmerican"),
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
  // Re-entrancy guards so decimal -> American -> decimal programmatic writes
  // don't loop through their own input listeners.
  syncingAmericanFromDecimal: false,
  syncingDecimalFromAmerican: false,
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

// --------------------------------------------------------------------------
// Decimal <-> American conversions
// --------------------------------------------------------------------------
//
// American odds are integers with |x| >= 100.
//
//   decimal 2.00  ->  american +100  (even money boundary)
//   decimal > 2.00 -> american = +(decimal - 1) * 100
//   decimal < 2.00 -> american = -100 / (decimal - 1)
//
// The conversion is lossy in the American -> decimal direction because
// American is integer-quantised. After a user edits the American field we
// back-populate the decimal field with the exact inverse so subsequent
// calculations stay consistent with what they see.
// --------------------------------------------------------------------------

function decimalToAmerican(decimal) {
  if (!Number.isFinite(decimal) || decimal <= 1) {
    return null;
  }
  if (decimal >= 2) {
    return Math.round((decimal - 1) * 100);
  }
  return Math.round(-100 / (decimal - 1));
}

function americanToDecimal(american) {
  if (!Number.isFinite(american) || american === 0) {
    return null;
  }
  if (american >= 100) {
    return american / 100 + 1;
  }
  if (american <= -100) {
    return 100 / Math.abs(american) + 1;
  }
  return null;
}

function formatAmericanDisplay(american) {
  if (!Number.isFinite(american)) {
    return "";
  }
  return american > 0 ? `+${american}` : String(american);
}

function formatDecimalDisplay(decimal) {
  if (!Number.isFinite(decimal)) {
    return "";
  }
  // Show up to 4 decimals and trim trailing zeros for readability.
  // Examples: 2.15 -> "2.15", 1.9174311926605505 -> "1.9174".
  const fixed = decimal.toFixed(4);
  return fixed.replace(/\.?0+$/, "");
}

function parseAmericanInput(rawValue) {
  const text = String(rawValue ?? "").trim().replace(/^\+/, "");
  if (!text) {
    return null;
  }
  // Accept negatives, positives, and leading-plus-stripped integers.
  // Reject anything with non-numeric content (decimals, letters, etc.).
  if (!/^-?\d+$/.test(text)) {
    return null;
  }
  const value = Number(text);
  if (!Number.isFinite(value) || value === 0) {
    return null;
  }
  if (Math.abs(value) < 100) {
    // Valid American odds always satisfy |x| >= 100. Reject intermediate
    // values instead of producing a silently-wrong decimal.
    return null;
  }
  return value;
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

function setDecimalField(decimalInput, decimalValue) {
  state.syncingDecimalFromAmerican = true;
  decimalInput.value = decimalValue === null || decimalValue === "" ? "" : formatDecimalDisplay(decimalValue);
  state.syncingDecimalFromAmerican = false;
}

function setAmericanField(americanInput, decimalValue) {
  state.syncingAmericanFromDecimal = true;
  const american = decimalToAmerican(decimalValue);
  americanInput.value = american === null ? "" : formatAmericanDisplay(american);
  state.syncingAmericanFromDecimal = false;
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

  // Initialize decimal + American fields together so both are in sync from
  // the moment the page loads.
  setDecimalField(dom.oddsA, config.oddsA);
  setDecimalField(dom.oddsB, config.oddsB);
  setAmericanField(dom.oddsAAmerican, config.oddsA);
  setAmericanField(dom.oddsBAmerican, config.oddsB);

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

// When the user types into a decimal field, mirror into the matching American
// field and recompute. Skipped when the write originated from American -> decimal.
function onDecimalInput(side) {
  if (state.syncingDecimalFromAmerican) {
    return;
  }
  const decimalInput = side === "a" ? dom.oddsA : dom.oddsB;
  const americanInput = side === "a" ? dom.oddsAAmerican : dom.oddsBAmerican;
  const value = Number(decimalInput.value);
  if (Number.isFinite(value) && value > 1) {
    setAmericanField(americanInput, value);
  } else {
    // Invalid or empty decimal: clear the American mirror so we don't show
    // a stale conversion.
    state.syncingAmericanFromDecimal = true;
    americanInput.value = "";
    state.syncingAmericanFromDecimal = false;
  }
  onOddsChanged();
}

// When the user types into an American field, parse it, compute the decimal
// equivalent, write that into the matching decimal field, then recompute.
// Skipped when the write originated from decimal -> American.
function onAmericanInput(side) {
  if (state.syncingAmericanFromDecimal) {
    return;
  }
  const decimalInput = side === "a" ? dom.oddsA : dom.oddsB;
  const americanInput = side === "a" ? dom.oddsAAmerican : dom.oddsBAmerican;
  const american = parseAmericanInput(americanInput.value);
  if (american === null) {
    // Leave the American text as-is (user may still be typing e.g. "-") but
    // clear the decimal mirror so downstream math doesn't use stale data.
    if (americanInput.value.trim() === "") {
      setDecimalField(decimalInput, null);
    } else {
      setDecimalField(decimalInput, null);
    }
    onOddsChanged();
    return;
  }
  const decimal = americanToDecimal(american);
  setDecimalField(decimalInput, decimal);
  onOddsChanged();
}

function resetToAlertOdds() {
  if (!state.config) {
    return;
  }
  setDecimalField(dom.oddsA, state.config.oddsA);
  setDecimalField(dom.oddsB, state.config.oddsB);
  setAmericanField(dom.oddsAAmerican, state.config.oddsA);
  setAmericanField(dom.oddsBAmerican, state.config.oddsB);
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
  dom.oddsA.addEventListener("input", () => onDecimalInput("a"));
  dom.oddsB.addEventListener("input", () => onDecimalInput("b"));
  dom.oddsAAmerican.addEventListener("input", () => onAmericanInput("a"));
  dom.oddsBAmerican.addEventListener("input", () => onAmericanInput("b"));
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
