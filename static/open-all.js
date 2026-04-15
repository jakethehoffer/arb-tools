const dom = {
  error: document.getElementById("launcherError"),
  content: document.getElementById("launcherContent"),
  status: document.getElementById("launcherStatus"),
  summary: document.getElementById("launcherSummary"),
  targets: document.getElementById("launcherTargets"),
  openAllButton: document.getElementById("launcherOpenAll"),
};

const state = {
  targets: [],
  results: [],
  // Raw v=3 base64url payload kept so the "Open all again" button can retry
  // the native arbtabs:// handler without needing to re-encode.
  v3Payload: null,
};

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

// Parse the v=3 ?payload= format emitted by the daemon after 2026-04-15.
// Payload is a base64url-encoded JSON object with {token, targets[], verify?}
// — the same envelope the arbtabs://launch?v=3&payload=... deep link carries,
// so we can pass it through to the native handler unchanged.
function readV3Payload() {
  const params = new URLSearchParams(window.location.search);
  const encoded = (params.get("payload") || "").trim();
  if (!encoded) {
    return null;
  }
  try {
    const decoded = decodeBase64Url(encoded);
    if (!decoded) {
      return null;
    }
    const parsed = JSON.parse(decoded);
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.targets)) {
      return null;
    }
    const targets = parsed.targets.map(normalizeTarget).filter(Boolean);
    if (!targets.length) {
      return null;
    }
    return { encoded, targets };
  } catch {
    return null;
  }
}

// Legacy v=2 format for pre-2026-04-15 alerts still in Telegram history.
// Just a base64url-encoded JSON array of {label,url,note?} entries.
function readV2Targets() {
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

function windowGeometry(index, total) {
  const availableWidth = Math.max(Number(window.screen?.availWidth) || window.innerWidth || 0, 960);
  const availableHeight = Math.max(Number(window.screen?.availHeight) || window.innerHeight || 0, 720);
  const columns = Math.min(3, Math.max(1, total));
  const rows = Math.max(1, Math.ceil(total / columns));
  const gap = 18;
  const width = Math.max(320, Math.floor((availableWidth - gap * (columns + 1)) / columns));
  const height = Math.max(380, Math.floor((availableHeight - gap * (rows + 1)) / rows));
  const column = index % columns;
  const row = Math.floor(index / columns);
  return {
    width,
    height,
    left: gap + column * (width + gap),
    top: gap + row * (height + gap),
  };
}

function windowFeatures(index) {
  const geometry = windowGeometry(index, state.targets.length);
  return [
    "popup=yes",
    "resizable=yes",
    "scrollbars=yes",
    `width=${geometry.width}`,
    `height=${geometry.height}`,
    `left=${geometry.left}`,
    `top=${geometry.top}`,
  ].join(",");
}

function renderTargets() {
  dom.targets.innerHTML = state.targets
    .map((target, index) => {
      const result = state.results[index] || { attempted: false, opened: false };
      const pillClass = result.attempted ? (result.opened ? "launcher-pill opened" : "launcher-pill blocked") : "launcher-pill";
      const pillText = result.attempted ? (result.opened ? "Opened" : "Blocked") : "Pending";
      const noteHtml = target.note ? `<div class="launcher-note">${escapeHtml(target.note)}</div>` : "";
      return `
        <article class="launcher-card">
          <div class="launcher-card-head">
            <div>
              <div class="launcher-card-title">${escapeHtml(target.label)}</div>
              ${noteHtml}
            </div>
            <div class="${pillClass}">${pillText}</div>
          </div>
          <a class="launcher-link" href="${escapeHtml(target.url)}" target="_blank" rel="noopener noreferrer">
            ${escapeHtml(target.url)}
          </a>
          <div class="launcher-card-actions">
            <button class="launcher-button launcher-button-secondary" data-action="retry" data-index="${index}" type="button">
              Open ${escapeHtml(target.label)}
            </button>
            <a class="launcher-inline-link" href="${escapeHtml(target.url)}" target="_blank" rel="noopener noreferrer">
              Direct link
            </a>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderStatus() {
  const total = state.targets.length;
  const attempted = state.results.filter((result) => result?.attempted).length;
  const opened = state.results.filter((result) => result?.opened).length;
  const blocked = attempted - opened;
  dom.summary.textContent = `${total} destination${total === 1 ? "" : "s"} ready.`;
  if (!attempted) {
    if (state.v3Payload) {
      dom.status.textContent = `Opening native Windows launcher for ${total} destination${total === 1 ? "" : "s"}…`;
    } else {
      dom.status.textContent = `Ready to open ${total} destination${total === 1 ? "" : "s"}.`;
    }
    return;
  }
  if (blocked <= 0) {
    dom.status.textContent = `Opened ${opened} window${opened === 1 ? "" : "s"}. If the browser reused existing windows, switch to them now.`;
    return;
  }
  dom.status.textContent = `Opened ${opened} of ${total}. ${blocked} blocked or failed. Use retry or the direct links below.`;
}

function openTarget(index) {
  const target = state.targets[index];
  if (!target) {
    return false;
  }
  let handle = null;
  try {
    handle = window.open(target.url, `arb-launch-target-${index}`, windowFeatures(index));
  } catch {
    handle = null;
  }
  state.results[index] = {
    attempted: true,
    opened: Boolean(handle),
  };
  renderTargets();
  renderStatus();
  return Boolean(handle);
}

function openAllTargets() {
  state.targets.forEach((_target, index) => {
    openTarget(index);
  });
}

// Invoke the native Windows arbtabs:// protocol handler. The Chromium
// protocol-handler prompt is triggered by navigating the page — the user
// gets a one-time "Open Telegram Alert Launcher?" dialog they can opt into
// permanently with "Always allow". If no handler is registered, the
// navigation silently fails and the page stays put; the popup fallback
// kicks in via openAllTargets after a short delay.
function triggerNativeHandler(encodedPayload) {
  const href = `arbtabs://launch?v=3&payload=${encodedPayload}`;
  try {
    // Use an anchor click rather than window.location.href — Chromium
    // treats an anchor click as a direct user gesture, which avoids some
    // popup/nav blockers and makes the protocol prompt appear reliably.
    const link = document.createElement("a");
    link.href = href;
    link.rel = "noopener noreferrer";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    try {
      window.location.href = href;
    } catch {
      // Swallow; the popup fallback handles this case.
    }
  }
}

function showInvalid(message) {
  dom.error.hidden = false;
  dom.error.textContent = message;
  dom.content.hidden = true;
  dom.status.textContent = "Open the launcher again from a fresh Telegram alert.";
}

function bindEvents() {
  dom.openAllButton.addEventListener("click", () => {
    if (state.v3Payload) {
      triggerNativeHandler(state.v3Payload.encoded);
    }
    openAllTargets();
  });
  dom.targets.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action='retry']");
    if (!button) {
      return;
    }
    const index = Number(button.dataset.index);
    if (!Number.isInteger(index)) {
      return;
    }
    openTarget(index);
  });
}

function init() {
  const v3 = readV3Payload();
  const v2Targets = v3 ? null : readV2Targets();

  if (!v3 && !v2Targets) {
    showInvalid("Invalid launcher link. Open the launcher again from a fresh Telegram alert.");
    return;
  }

  if (v3) {
    state.v3Payload = v3;
    state.targets = v3.targets;
  } else {
    state.targets = v2Targets;
  }
  state.results = state.targets.map(() => ({ attempted: false, opened: false }));

  dom.error.hidden = true;
  dom.content.hidden = false;
  renderTargets();
  renderStatus();
  bindEvents();

  if (state.v3Payload) {
    // Fire the native Windows handler immediately — this is the whole point
    // of the v=3 flow. If the handler takes over the browser navigates to
    // the protocol and the popup fallback never runs. Otherwise give the
    // browser a brief window to show the "open external app" prompt, then
    // fall back to the popup flow as a safety net.
    triggerNativeHandler(state.v3Payload.encoded);
    window.setTimeout(() => {
      if (document.visibilityState === "visible") {
        openAllTargets();
      }
    }, 1800);
  } else {
    openAllTargets();
  }
}

init();
