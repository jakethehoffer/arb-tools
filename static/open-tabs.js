const dom = {
  heading: document.getElementById("tabBootstrapHeading"),
  status: document.getElementById("tabBootstrapStatus"),
  error: document.getElementById("tabBootstrapError"),
  fallback: document.getElementById("tabBootstrapFallback"),
  hint: document.getElementById("tabBootstrapHint"),
  primaryLink: document.getElementById("tabBootstrapPrimaryLink"),
  openAllLink: document.getElementById("tabBootstrapOpenAllLink"),
  installCommand: document.getElementById("tabBootstrapInstallCommand"),
};

const state = {
  targets: [],
  redirected: false,
  launchToken: null,
  lastError: null,
};

const STATUS_POLL_INTERVAL_MS = 250;
const STATUS_POLL_TIMEOUT_MS = 8000;
const STATIC_REDIRECT_DELAY_MS = 2000;
const INSTALL_COMMAND = "powershell -ExecutionPolicy Bypass -File scripts/install_telegram_edge_tab_helper.ps1";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function decodeBase64Url(value) {
  const normalized = String(value || "")
    .trim()
    .replaceAll("-", "+")
    .replaceAll("_", "/");
  if (!normalized) {
    return null;
  }
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4 || 4)) % 4), "=");
  const binary = window.atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeBase64Url(value) {
  const bytes = new TextEncoder().encode(String(value ?? ""));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll(/=+$/g, "");
}

function normalizeUrl(rawValue) {
  const text = String(rawValue ?? "").trim();
  if (!text) {
    return null;
  }
  try {
    const parsed = new URL(text);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function normalizeTarget(rawTarget) {
  if (!rawTarget || typeof rawTarget !== "object") {
    return null;
  }
  const label = String(rawTarget.label ?? "").trim();
  const url = normalizeUrl(rawTarget.url);
  const note = String(rawTarget.note ?? "").trim();
  if (!label || !url) {
    return null;
  }
  const target = { label, url };
  if (note) {
    target.note = note;
  }
  return target;
}

function readTargets() {
  const params = new URLSearchParams(window.location.search);
  const encoded = (params.get("targets") || "").trim();
  if (!encoded) {
    return null;
  }
  try {
    const decoded = decodeBase64Url(encoded);
    if (!decoded) {
      return null;
    }
    const parsed = JSON.parse(decoded);
    if (!Array.isArray(parsed)) {
      return null;
    }
    const targets = parsed.map(normalizeTarget).filter(Boolean);
    return targets.length ? targets : null;
  } catch {
    return null;
  }
}

function buildOpenAllUrl(targets) {
  const encodedTargets = encodeBase64Url(JSON.stringify(targets));
  return `/open-all?targets=${encodeURIComponent(encodedTargets)}`;
}

function buildStatusUrl(token) {
  return `/open-tabs/status?token=${encodeURIComponent(token)}`;
}

function buildProtocolUri(targets, token) {
  const secondaryUrls = targets.slice(1).map((target) => target.url);
  const encodedUrls = encodeBase64Url(JSON.stringify(secondaryUrls));
  return `arbtabs://launch?v=2&token=${encodeURIComponent(token)}&urls=${encodeURIComponent(encodedUrls)}`;
}

function generateLaunchToken() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (window.crypto && typeof window.crypto.getRandomValues === "function") {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function redirectPrimary() {
  if (state.redirected || !state.targets.length) {
    return;
  }
  state.redirected = true;
  dom.status.textContent = "Native helper confirmed. Redirecting to the primary page.";
  window.location.replace(state.targets[0].url);
}

function showFallback(message) {
  const primaryTarget = state.targets[0] || null;
  dom.heading.textContent = "Need native helper";
  dom.status.textContent = "The automatic Edge handoff did not complete.";
  dom.error.hidden = false;
  dom.error.textContent = message;
  dom.fallback.hidden = false;
  dom.installCommand.textContent = INSTALL_COMMAND;
  if (primaryTarget) {
    dom.primaryLink.href = primaryTarget.url;
    dom.primaryLink.textContent = `Open ${primaryTarget.label}`;
  } else {
    dom.primaryLink.href = "/calculator";
    dom.primaryLink.textContent = "Open primary page";
  }
  dom.openAllLink.href = buildOpenAllUrl(state.targets);
}

function showInvalid(message) {
  dom.heading.textContent = "Invalid tab opener link";
  dom.status.textContent = "Open the Telegram alert again.";
  dom.error.hidden = false;
  dom.error.textContent = message;
  dom.fallback.hidden = false;
  dom.hint.textContent = "Use the browser launcher fallback or send a fresh Telegram alert.";
  dom.installCommand.textContent = INSTALL_COMMAND;
  dom.primaryLink.textContent = "Open calculator";
  dom.primaryLink.href = "/calculator";
  dom.openAllLink.href = "/open-all";
}

function attemptNativeLaunch(protocolUri) {
  if (typeof window.__arbTabsLaunchHook === "function") {
    window.__arbTabsLaunchHook(protocolUri, state.launchToken);
    return;
  }

  const frame = document.createElement("iframe");
  frame.hidden = true;
  frame.setAttribute("aria-hidden", "true");
  frame.src = protocolUri;
  document.body.appendChild(frame);
  window.setTimeout(() => {
    frame.remove();
  }, 2000);
}

async function readLaunchStatus(token) {
  const response = await window.fetch(buildStatusUrl(token), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });
  const payload = await response.json();
  if (!response.ok) {
    const error = payload && payload.error ? payload.error : `status endpoint returned ${response.status}`;
    throw new Error(error);
  }
  return payload;
}

async function pollLaunchStatus(token) {
  const deadline = window.performance.now() + STATUS_POLL_TIMEOUT_MS;
  while (window.performance.now() < deadline) {
    const payload = await readLaunchStatus(token);
    const launchState = String(payload?.state || "").trim().toLowerCase();
    if (launchState === "succeeded") {
      return payload;
    }
    if (launchState === "failed") {
      const error = payload?.error ? String(payload.error) : "Native helper failed to open the additional Edge tabs.";
      throw new Error(error);
    }
    await new Promise((resolve) => {
      window.setTimeout(resolve, STATUS_POLL_INTERVAL_MS);
    });
  }
  throw new Error("Native Edge tab helper did not confirm success in time.");
}

function isStaticHosted() {
  const hostname = (window.location.hostname || "").toLowerCase();
  return hostname.endsWith(".github.io") || hostname.endsWith(".pages.dev");
}

function init() {
  const targets = readTargets();
  if (!targets || targets.length < 2 || targets.length > 3) {
    showInvalid("Invalid tab opener link. Open the Telegram alert again.");
    return;
  }

  state.targets = targets;
  state.launchToken = generateLaunchToken();
  dom.installCommand.textContent = INSTALL_COMMAND;
  const protocolUri = buildProtocolUri(targets, state.launchToken);
  dom.status.textContent = `Waiting for the native helper to open ${targets.length - 1} additional tab${targets.length === 2 ? "" : "s"} in Edge.`;
  attemptNativeLaunch(protocolUri);

  if (isStaticHosted()) {
    // Static sites have no /open-tabs/status endpoint — redirect to the
    // calculator after a short delay to give the native helper time to open
    // the bookmaker tabs.
    window.setTimeout(() => {
      redirectPrimary();
    }, STATIC_REDIRECT_DELAY_MS);
    return;
  }

  pollLaunchStatus(state.launchToken)
    .then(() => {
      redirectPrimary();
    })
    .catch((error) => {
      state.lastError = String(error?.message || error || "Native Edge tab helper did not confirm success.");
      showFallback(state.lastError);
    });
}

init();
