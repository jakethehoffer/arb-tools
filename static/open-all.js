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
    dom.status.textContent = `Ready to open ${total} destination${total === 1 ? "" : "s"}.`;
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

function showInvalid(message) {
  dom.error.hidden = false;
  dom.error.textContent = message;
  dom.content.hidden = true;
  dom.status.textContent = "Open the launcher again from a fresh Telegram alert.";
}

function bindEvents() {
  dom.openAllButton.addEventListener("click", () => {
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
  const targets = readTargets();
  if (!targets) {
    showInvalid("Invalid launcher link. Open the launcher again from a fresh Telegram alert.");
    return;
  }

  state.targets = targets;
  state.results = targets.map(() => ({ attempted: false, opened: false }));

  dom.error.hidden = true;
  dom.content.hidden = false;
  renderTargets();
  renderStatus();
  bindEvents();
  openAllTargets();
}

init();
