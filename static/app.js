const state = {
  events: [],
  eventOffset: 0,
  eventLimit: 200,
  selectedEvent: null,
  oddsScreen: { bookmakers: [], rows: [] },
  oddsScreenOffset: 0,
  oddsScreenLimit: 200,
  oddsScreenHasMore: true,
  oddsScreenTotalRows: null,
  oddsScreenTotalsLoading: false,
  oddsScreenMaxRows: null,
  oddsScreenIsCapped: false,
  oddsScreenWarning: null,
  oddsScreenLoading: false,
  oddsScreenAutoRefreshEnabled: true,
  oddsOutcomeContext: new Map(),
  oddsMarketContext: new Map(),
  oddsHistoryOutcomeId: null,
  oddsHistoryMarketId: null,
  oddsHistoryMode: "outcome",
  oddsHistoryLoading: false,
  oddsHistoryPayload: null,
  oddsHistoryLookbackHours: 24,
  oddsHistoryMaxPoints: 30,
  bookmakers: [],
  selectedBookmakerIds: new Set(),
  bookmakerFilterAll: true,
  presets: [],
  workerStatus: null,
  alerts: [],
  alertHits: [],
  alertHitsLoading: false,
  alertHitsLimit: 100,
  arbitrage: [],
  ev: [],
  arbSearch: [],
  arbSearchOffset: 0,
  arbSearchLimit: 100,
  arbSearchHasMore: true,
  arbSearchLoading: false,
  arbSearchAutoRefreshEnabled: false,
  arbSearchRefreshIntervalMs: 15000,
  arbSearchBookmakerMode: "include_selected",
  arbSearchMaxAgeSeconds: null,
  arbSearchSort: "arb_desc",
  arbSearchExpandedKeys: new Set(),
  ingestTriggerRunId: null,
  ingestTriggerPollingTimer: null,
  ingestTriggerInFlight: false,
  ingestTriggerLastStatus: null,
  lowHoldSearch: [],
  lowHoldSearchOffset: 0,
  lowHoldSearchLimit: 100,
  lowHoldSearchHasMore: true,
  lowHoldSearchLoading: false,
  evSearch: [],
  evSearchOffset: 0,
  evSearchLimit: 100,
  evSearchHasMore: true,
  evSearchLoading: false,
  activeTab: "odds",
};

const dom = {
  ingestSummary: document.getElementById("ingestSummary"),
  ingestDetails: document.getElementById("ingestDetails"),
  refreshHealth: document.getElementById("refreshHealth"),
  workerStatus: document.getElementById("workerStatus"),
  workerMeta: document.getElementById("workerMeta"),
  workerStart: document.getElementById("workerStart"),
  workerStop: document.getElementById("workerStop"),
  filterSport: document.getElementById("filterSport"),
  filterLeague: document.getElementById("filterLeague"),
  filterStartAfter: document.getElementById("filterStartAfter"),
  filterStartBefore: document.getElementById("filterStartBefore"),
  filterSearch: document.getElementById("filterSearch"),
  teamOptions: document.getElementById("teamOptions"),
  sportOptions: document.getElementById("sportOptions"),
  leagueOptions: document.getElementById("leagueOptions"),
  bookmakerFilters: document.getElementById("bookmakerFilters"),
  presetSelect: document.getElementById("presetSelect"),
  presetName: document.getElementById("presetName"),
  presetImportNotice: document.getElementById("presetImportNotice"),
  savePreset: document.getElementById("savePreset"),
  applyPreset: document.getElementById("applyPreset"),
  deletePreset: document.getElementById("deletePreset"),
  sharePreset: document.getElementById("sharePreset"),
  exportPreset: document.getElementById("exportPreset"),
  importPreset: document.getElementById("importPreset"),
  alertSelect: document.getElementById("alertSelect"),
  alertName: document.getElementById("alertName"),
  alertType: document.getElementById("alertType"),
  saveAlert: document.getElementById("saveAlert"),
  scanAlert: document.getElementById("scanAlert"),
  deleteAlert: document.getElementById("deleteAlert"),
  alertStatus: document.getElementById("alertStatus"),
  applyFilters: document.getElementById("applyFilters"),
  resetFilters: document.getElementById("resetFilters"),
  eventsList: document.getElementById("eventsList"),
  eventsMeta: document.getElementById("eventsMeta"),
  loadMore: document.getElementById("loadMore"),
  eventTitle: document.getElementById("eventTitle"),
  eventMeta: document.getElementById("eventMeta"),
  refreshEvent: document.getElementById("refreshEvent"),
  runIngestBtn: document.getElementById("runIngestBtn"),
  runIngestStatus: document.getElementById("runIngestStatus"),
  apiBadge: document.getElementById("apiBadge"),
  apiStart: document.getElementById("apiStart"),
  pills: Array.from(document.querySelectorAll(".pill")),
  oddsView: document.getElementById("oddsView"),
  arbView: document.getElementById("arbView"),
  evView: document.getElementById("evView"),
  arbSearchHelpNote: document.getElementById("arbSearchHelpNote"),
  arbSearchView: document.getElementById("arbSearchView"),
  lowHoldView: document.getElementById("lowHoldView"),
  evSearchView: document.getElementById("evSearchView"),
  alertsView: document.getElementById("alertsView"),
  filterMarketKey: document.getElementById("filterMarketKey"),
  filterPeriod: document.getElementById("filterPeriod"),
  marketOptions: document.getElementById("marketOptions"),
  periodOptions: document.getElementById("periodOptions"),
  filterMinArb: document.getElementById("filterMinArb"),
  filterMaxOverround: document.getElementById("filterMaxOverround"),
  filterMinEv: document.getElementById("filterMinEv"),
  toggleIncludeNegative: document.getElementById("toggleIncludeNegative"),
  toggleAllowSingleBook: document.getElementById("toggleAllowSingleBook"),
  toggleOnlySelected: document.getElementById("toggleOnlySelected"),
  toggleAutoRefresh: document.getElementById("toggleAutoRefresh"),
  toggleArbSearchAutoRefresh: document.getElementById("toggleArbSearchAutoRefresh"),
  arbSearchRefreshInterval: document.getElementById("arbSearchRefreshInterval"),
  arbBookmakerMode: document.getElementById("arbBookmakerMode"),
  arbSearchMaxAgeSeconds: document.getElementById("arbSearchMaxAgeSeconds"),
  arbSearchSort: document.getElementById("arbSearchSort"),
  toggleIncludeStale: document.getElementById("toggleIncludeStale"),
  toggleIncludeUnhealthy: document.getElementById("toggleIncludeUnhealthy"),
  arbFilterWrap: document.getElementById("arbFilterWrap"),
  arbSearchAutoRefreshWrap: document.getElementById("arbSearchAutoRefreshWrap"),
  arbSearchIntervalWrap: document.getElementById("arbSearchIntervalWrap"),
  arbBookmakerModeWrap: document.getElementById("arbBookmakerModeWrap"),
  arbSearchMaxAgeWrap: document.getElementById("arbSearchMaxAgeWrap"),
  arbSearchSortWrap: document.getElementById("arbSearchSortWrap"),
  lowHoldFilterWrap: document.getElementById("lowHoldFilterWrap"),
  evFilterWrap: document.getElementById("evFilterWrap"),
  evIncludeWrap: document.getElementById("evIncludeWrap"),
  evSingleBookWrap: document.getElementById("evSingleBookWrap"),
  oddsLoadMore: document.getElementById("oddsLoadMore"),
  oddsLoadMeta: document.getElementById("oddsLoadMeta"),
  oddsWarning: document.getElementById("oddsWarning"),
  oddsActions: document.getElementById("oddsActions"),
  arbSearchActions: document.getElementById("arbSearchActions"),
  lowHoldActions: document.getElementById("lowHoldActions"),
  evSearchActions: document.getElementById("evSearchActions"),
  arbSearchMeta: document.getElementById("arbSearchMeta"),
  lowHoldMeta: document.getElementById("lowHoldMeta"),
  evSearchMeta: document.getElementById("evSearchMeta"),
  arbSearchLoadMore: document.getElementById("arbSearchLoadMore"),
  lowHoldLoadMore: document.getElementById("lowHoldLoadMore"),
  evSearchLoadMore: document.getElementById("evSearchLoadMore"),
  historyModal: document.getElementById("historyModal"),
  historyClose: document.getElementById("historyClose"),
  historyTitle: document.getElementById("historyTitle"),
  historyMeta: document.getElementById("historyMeta"),
  historyContent: document.getElementById("historyContent"),
  historyLookback: document.getElementById("historyLookback"),
  historyMaxPoints: document.getElementById("historyMaxPoints"),
  ariaStatus: document.getElementById("ariaStatus"),
  liveBadge: document.getElementById("liveBadge"),
  toast: document.getElementById("toast"),
};

if (dom.arbSearchRefreshInterval) {
  const interval = Number(dom.arbSearchRefreshInterval.value);
  state.arbSearchRefreshIntervalMs = Number.isFinite(interval) && interval > 0 ? Math.floor(interval) : 15000;
}
if (dom.arbBookmakerMode) {
  state.arbSearchBookmakerMode = dom.arbBookmakerMode.value || "include_selected";
}
if (dom.arbSearchSort) {
  state.arbSearchSort = dom.arbSearchSort.value || "arb_desc";
}
if (dom.toggleArbSearchAutoRefresh) {
  state.arbSearchAutoRefreshEnabled = Boolean(dom.toggleArbSearchAutoRefresh.checked);
}

let oddsScreenStream = null;
let oddsScreenStreamLastRefresh = 0;
let oddsScreenStreamConnected = false;
let arbSearchRefreshTimer = null;
const ODDS_STREAM_MIN_INTERVAL_MS = 5000;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    dom.toast.classList.remove("show");
  }, 2400);
}

function showPresetImportNotice(name) {
  if (!dom.presetImportNotice) {
    return;
  }
  const label = name ? `Imported shared preset: ${name}` : "Imported shared preset.";
  dom.presetImportNotice.textContent = label;
  dom.presetImportNotice.classList.add("show");
  clearTimeout(showPresetImportNotice._timer);
  showPresetImportNotice._timer = setTimeout(() => {
    dom.presetImportNotice.classList.remove("show");
  }, 5000);
}

function setAlertStatus(message, isLoading = false) {
  if (!dom.alertStatus) {
    return;
  }
  const text = message || "";
  dom.alertStatus.textContent = text;
  dom.alertStatus.classList.toggle("loading", Boolean(isLoading && !text));
}

function announceStatus(message) {
  if (!dom.ariaStatus) {
    return;
  }
  dom.ariaStatus.textContent = "";
  window.requestAnimationFrame(() => {
    dom.ariaStatus.textContent = message;
  });
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value || "";
  }
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatPrice(value) {
  if (value === null || value === undefined) {
    return "-";
  }
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return "-";
  }
  return num.toFixed(2);
}

function formatPercent(value) {
  if (!Number.isFinite(value)) {
    return "-";
  }
  return `${value.toFixed(2)}%`;
}

function formatMarketBits(market) {
  if (!market) {
    return "";
  }
  const lineText = market.line !== null && market.line !== undefined ? `Line ${market.line}` : "";
  const roundText =
    market.round_number !== null && market.round_number !== undefined ? `Round ${market.round_number}` : "";
  const teamSide = market.team_side ? `Side ${market.team_side}` : "";
  return [lineText, roundText, teamSide].filter(Boolean).join(" | ");
}

function formatDecimalCompact(value, digits = 4) {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return "-";
  }
  return num.toFixed(digits).replace(/\.?0+$/, "");
}

function formatArbMarketIdentity(market) {
  if (!market) {
    return "";
  }
  const line = market.line !== null && market.line !== undefined ? formatDecimalCompact(market.line, 6) : "n/a";
  const round = market.round_number !== null && market.round_number !== undefined ? String(market.round_number) : "n/a";
  const side = market.team_side || "n/a";
  return `${market.market_key}|${market.period}|line=${line}|round=${round}|side=${side}`;
}

function getMarketPhaseLabel(period) {
  if (!period) {
    return "Match";
  }
  if (period === "full_time") {
    return "Match";
  }
  const mapMatch = String(period).match(/^map(\d+)$/i);
  if (mapMatch) {
    return `Map ${mapMatch[1]}`;
  }
  return String(period);
}

function formatArbMarketHint(market) {
  if (!market) {
    return "";
  }
  const phase = getMarketPhaseLabel(market.period);
  const lineText = market.line !== null && market.line !== undefined ? ` ${formatDecimalCompact(market.line)}` : "";
  switch (market.market_key) {
    case "match_winner":
      return "Match Winner";
    case "map_winner":
      return `${phase} Winner`;
    case "total_maps":
      return `Total Maps O/U${lineText}`;
    case "spread":
      return `${phase} Handicap${lineText}`;
    case "correct_score":
      return "Correct Score";
    case "total_points":
      return `${phase} Total Rounds O/U${lineText}`;
    default:
      return formatArbMarketIdentity(market);
  }
}

function parseDateMs(value) {
  if (!value) {
    return null;
  }
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

function formatDateTimeDetailed(value) {
  const ms = parseDateMs(value);
  if (ms === null) {
    return value || "";
  }
  const date = new Date(ms);
  return `${date.toLocaleString()} (${new Date(ms).toISOString()})`;
}

function formatAgeSeconds(value) {
  if (!Number.isFinite(value)) {
    return "n/a";
  }
  const total = Math.max(0, Math.round(value));
  if (total < 60) {
    return `${total}s`;
  }
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  if (mins < 60) {
    return secs ? `${mins}m ${secs}s` : `${mins}m`;
  }
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins ? `${hours}h ${remMins}m` : `${hours}h`;
}

function getArbOutcomeAgeSeconds(outcome, nowMs = Date.now()) {
  const ts = parseDateMs(outcome?.best_price_last_update);
  if (ts === null) {
    return null;
  }
  return Math.max(0, Math.floor((nowMs - ts) / 1000));
}

function getArbStalenessSummary(arb, nowMs = Date.now()) {
  const outcomes = Array.isArray(arb?.outcomes) ? arb.outcomes : [];
  const ages = [];
  const updates = [];
  outcomes.forEach((outcome) => {
    const age = getArbOutcomeAgeSeconds(outcome, nowMs);
    if (Number.isFinite(age)) {
      ages.push(age);
    }
    const updateMs = parseDateMs(outcome?.best_price_last_update);
    if (updateMs !== null) {
      updates.push(updateMs);
    }
  });
  return {
    knownCount: ages.length,
    totalCount: outcomes.length,
    oldestAgeSeconds: ages.length ? Math.max(...ages) : null,
    newestAgeSeconds: ages.length ? Math.min(...ages) : null,
    newestUpdateIso: updates.length ? new Date(Math.max(...updates)).toISOString() : null,
  };
}

function getArbUiKey(arb) {
  if (!arb || !arb.market || !arb.event) {
    return "";
  }
  const event = arb.event;
  const market = arb.market;
  const outcomeBits = (Array.isArray(arb.outcomes) ? arb.outcomes : [])
    .map((outcome) => `${outcome?.outcome_key || ""}:${outcome?.bookmaker?.key || outcome?.bookmaker?.id || ""}`)
    .sort()
    .join("|");
  return [
    event.event_key || `${event.id || ""}`,
    market.market_key || "",
    market.period || "",
    market.line ?? "",
    market.round_number ?? "",
    market.team_side || "",
    outcomeBits,
  ].join("|");
}

function getArbSourceMatchup(outcome, arbEvent) {
  const hint = outcome?.source_hint || null;
  const home = hint?.source_home_team || "";
  const away = hint?.source_away_team || "";
  if (home && away) {
    return `${home} vs ${away}`;
  }
  if (arbEvent) {
    return `${arbEvent.home_team || ""} vs ${arbEvent.away_team || ""}`.trim();
  }
  return "";
}

function getArbStalenessBadgeClass(summary, maxAgeSeconds) {
  const oldest = summary?.oldestAgeSeconds;
  if (!Number.isFinite(oldest)) {
    return "";
  }
  if (Number.isFinite(maxAgeSeconds) && maxAgeSeconds > 0) {
    if (oldest > maxAgeSeconds) {
      return "stale";
    }
    if (oldest > maxAgeSeconds * 0.75) {
      return "warn";
    }
    return "good";
  }
  if (oldest >= 900) {
    return "stale";
  }
  if (oldest >= 300) {
    return "warn";
  }
  return "good";
}

function renderApiBadge(status) {
  if (!dom.apiBadge) {
    return;
  }
  const label = dom.apiBadge.querySelector(".label");
  dom.apiBadge.classList.remove("running", "offline", "checking");
  if (status === "running") {
    dom.apiBadge.classList.add("running");
    if (label) {
      label.textContent = "API running";
    }
  } else if (status === "offline") {
    dom.apiBadge.classList.add("offline");
    if (label) {
      label.textContent = "API offline";
    }
  } else {
    dom.apiBadge.classList.add("checking");
    if (label) {
      label.textContent = "API checking";
    }
  }
  if (dom.apiStart) {
    dom.apiStart.disabled = status === "running";
  }
}

async function loadApiStatus() {
  if (!dom.apiBadge) {
    return;
  }
  renderApiBadge("checking");
  try {
    await fetchJson("/health");
    renderApiBadge("running");
  } catch (err) {
    renderApiBadge("offline");
  }
}

async function startApiHelper() {
  const command = "python server.py";
  try {
    await fetchJson("/health");
    renderApiBadge("running");
    showToast("API already running");
    return;
  } catch (err) {
    renderApiBadge("offline");
  }
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(command);
      showToast("API start command copied");
    } catch (err) {
      window.prompt("Run this command in a terminal", command);
    }
  } else {
    window.prompt("Run this command in a terminal", command);
  }
}

function buildSparkline(values) {
  if (!Array.isArray(values) || values.length < 2) {
    return "<div class=\"meta\">No movement</div>";
  }
  const width = 160;
  const height = 32;
  const padding = 2;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = (width - padding * 2) / (values.length - 1);
  const points = values
    .map((value, index) => {
      const x = padding + index * step;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return `<svg class="sparkline" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><polyline points="${points}" /></svg>`;
}

function formatLookbackLabel(hours) {
  if (!Number.isFinite(hours)) {
    return "";
  }
  if (hours === 168) {
    return "7d";
  }
  return `${hours}h`;
}

function getHistoryLookbackHours() {
  if (!dom.historyLookback) {
    return state.oddsHistoryLookbackHours;
  }
  const value = Number(dom.historyLookback.value);
  if (Number.isFinite(value) && value > 0) {
    return value;
  }
  return state.oddsHistoryLookbackHours;
}

function getHistoryMaxPoints() {
  if (!dom.historyMaxPoints) {
    return state.oddsHistoryMaxPoints;
  }
  const value = Number(dom.historyMaxPoints.value);
  if (Number.isFinite(value) && value > 0) {
    return value;
  }
  return state.oddsHistoryMaxPoints;
}

function buildQuery(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

function getSearchTerm() {
  if (!dom.filterSearch) {
    return "";
  }
  return dom.filterSearch.value.trim().toLowerCase();
}

function eventMatchesSearch(event, searchTerm) {
  if (!searchTerm) {
    return true;
  }
  if (!event) {
    return false;
  }
  const haystack = `${event.home_team || ""} ${event.away_team || ""} ${event.league || ""}`.toLowerCase();
  return haystack.includes(searchTerm);
}

function updateHeader() {
  updateEventRequiredHints();
  if (state.activeTab === "odds") {
    const totalRows = Number.isFinite(state.oddsScreenTotalRows) ? state.oddsScreenTotalRows : null;
    const filtered = dom.toggleOnlySelected && dom.toggleOnlySelected.checked && state.selectedEvent;
    dom.eventTitle.textContent = "Odds Screen";
    dom.eventMeta.textContent = totalRows === null
      ? "Aggregated across events using the current filters."
      : `Aggregated across events using the current filters. Total rows: ${totalRows}${filtered ? " (filtered to selected event)" : ""}`;
    dom.refreshEvent.textContent = "Refresh Screen";
    dom.oddsLoadMore.style.display = state.oddsScreenHasMore ? "inline-flex" : "none";
    updateOddsLoadMeta();
    updateLiveBadge();
    return;
  }

  dom.oddsLoadMore.style.display = "none";
  dom.oddsLoadMeta.textContent = "";
  dom.oddsLoadMeta.style.display = "none";
  dom.oddsLoadMeta.classList.remove("loading");
  updateOddsWarning();
  updateLiveBadge();
  if (state.activeTab === "arb-search") {
    dom.eventTitle.textContent = "Arbitrage Scanner";
    dom.eventMeta.textContent = "Scanning across events using the current filters.";
    dom.refreshEvent.textContent = "Refresh Scanner";
    return;
  }
  if (state.activeTab === "low-hold") {
    dom.eventTitle.textContent = "Low Hold Scanner";
    dom.eventMeta.textContent = "Scanning for low overround markets using the current filters.";
    dom.refreshEvent.textContent = "Refresh Scanner";
    return;
  }
  if (state.activeTab === "ev-search") {
    dom.eventTitle.textContent = "EV Scanner";
    dom.eventMeta.textContent = "Scanning across events using the current filters.";
    dom.refreshEvent.textContent = "Refresh Scanner";
    return;
  }
  if (state.activeTab === "alerts") {
    const alert = getSelectedAlert();
    dom.eventTitle.textContent = alert ? `Alert: ${alert.name}` : "Alerts";
    dom.eventMeta.textContent = alert
      ? `Type: ${alert.alert_type.replace("_", " ") || "alert"}`
      : "Saved alert hits and scans.";
    dom.refreshEvent.textContent = "Refresh Alerts";
    return;
  }
  dom.refreshEvent.textContent = "Refresh Event";
  if (state.selectedEvent) {
    const event = state.selectedEvent;
    dom.eventTitle.textContent = `${event.home_team} vs ${event.away_team}`;
    dom.eventMeta.textContent = `${event.league} | ${formatDateTime(event.start_time)} | ${event.sport}`;
  } else {
    dom.eventTitle.textContent = "Pick an event to view odds";
    dom.eventMeta.textContent = "Filters drive the list on the left.";
  }
}

function updateEventRequiredHints() {
  const hints = document.querySelectorAll(".pill-hint[data-requires-event=\"true\"]");
  const show = !state.selectedEvent;
  hints.forEach((hint) => {
    hint.classList.toggle("show", show);
  });
}

function toLocalInputValue(value) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const pad = (num) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function getBookmakerSelectionSet() {
  return state.selectedBookmakerIds;
}

function isBookmakerSelected(bookmakerId) {
  if (state.bookmakerFilterAll) {
    return true;
  }
  const selected = getBookmakerSelectionSet();
  return selected.has(bookmakerId);
}

function getVisibleBookmakers() {
  const books = Array.isArray(state.oddsScreen.bookmakers) ? state.oddsScreen.bookmakers : [];
  if (state.bookmakerFilterAll) {
    return books;
  }
  return books.filter((book) => state.selectedBookmakerIds.has(book.id));
}

function updateLiveBadge() {
  if (!dom.liveBadge) {
    return;
  }
  if (state.activeTab !== "odds") {
    dom.liveBadge.style.display = "none";
    return;
  }
  dom.liveBadge.style.display = "inline-flex";
  const label = dom.liveBadge.querySelector(".label");
  if (!state.oddsScreenAutoRefreshEnabled) {
    dom.liveBadge.classList.add("off");
    dom.liveBadge.classList.remove("connecting");
    if (label) {
      label.textContent = "Paused";
    }
    return;
  }
  dom.liveBadge.classList.remove("off");
  if (oddsScreenStreamConnected) {
    dom.liveBadge.classList.remove("connecting");
    if (label) {
      label.textContent = "Live";
    }
  } else {
    dom.liveBadge.classList.add("connecting");
    if (label) {
      label.textContent = "Connecting";
    }
  }
}

function showHistoryModal() {
  if (!dom.historyModal) {
    return;
  }
  dom.historyModal.classList.add("show");
  dom.historyModal.setAttribute("aria-hidden", "false");
}

function closeHistoryModal() {
  if (!dom.historyModal) {
    return;
  }
  dom.historyModal.classList.remove("show");
  dom.historyModal.setAttribute("aria-hidden", "true");
  state.oddsHistoryOutcomeId = null;
  state.oddsHistoryMarketId = null;
  state.oddsHistoryMode = "outcome";
  state.oddsHistoryLoading = false;
  state.oddsHistoryPayload = null;
}

function renderOddsHistory(data) {
  if (!dom.historyContent) {
    return;
  }
  const series = Array.isArray(data?.series) ? data.series : [];
  const visibleSeries = state.bookmakerFilterAll
    ? series
    : series.filter((item) => state.selectedBookmakerIds.has(item.bookmaker.id));
  if (!visibleSeries.length) {
    dom.historyContent.innerHTML = "<div class=\"data-card\">No odds history available in this window.</div>";
    return;
  }

  const cards = visibleSeries
    .map((entry) => {
      const points = Array.isArray(entry.points) ? entry.points : [];
      const values = points.map((point) => Number(point.price)).filter((value) => Number.isFinite(value));
      const latest = points.length ? points[points.length - 1] : null;
      const previous = points.length > 1 ? points[points.length - 2] : null;
      const delta = latest && previous ? latest.price - previous.price : 0;
      const deltaLabel = delta === 0 ? "No move" : delta > 0 ? `Up ${delta.toFixed(2)}` : `Down ${Math.abs(delta).toFixed(2)}`;
      const deltaClass = delta > 0 ? "good" : delta < 0 ? "warn" : "";
      const recentPoints = points.slice(-5).reverse();
      const recentRows = recentPoints
        .map((point) => {
          return `
            <div class="history-point">
              <div class="meta">${formatDateTime(point.recorded_at)}</div>
              <div class="badge">${formatPrice(point.price)}</div>
            </div>
          `;
        })
        .join("");

      return `
        <div class="history-series">
          <div class="history-series-head">
            <div>
              <div class="event-title">${escapeHtml(entry.bookmaker.name)}</div>
              <div class="meta">${latest ? `Last update ${formatDateTime(latest.recorded_at)}` : "No updates"}</div>
            </div>
            <div class="badge ${deltaClass}">${deltaLabel}</div>
          </div>
          ${buildSparkline(values)}
          <div class="history-points">${recentRows || "<div class=\"meta\">No recent ticks</div>"}</div>
        </div>
      `;
    })
    .join("");

  dom.historyContent.innerHTML = `<div class="history-grid">${cards}</div>`;
}

function renderMarketHistory(data) {
  if (!dom.historyContent) {
    return;
  }
  const outcomes = Array.isArray(data?.outcomes) ? data.outcomes : [];
  if (!outcomes.length) {
    dom.historyContent.innerHTML = "<div class=\"data-card\">No market history available in this window.</div>";
    return;
  }
  const cards = outcomes
    .map((entry) => {
      const outcome = entry.outcome || {};
      const series = Array.isArray(entry.series) ? entry.series : [];
      const visibleSeries = state.bookmakerFilterAll
        ? series
        : series.filter((item) => state.selectedBookmakerIds.has(item.bookmaker.id));
      if (!visibleSeries.length) {
        return `
          <div class="data-card history-outcome">
            <div class="history-outcome-title">${escapeHtml(outcome.label || "Outcome")}</div>
            <div class="meta">No data for selected bookmakers.</div>
          </div>
        `;
      }
      const seriesCards = visibleSeries
        .map((seriesEntry) => {
          const points = Array.isArray(seriesEntry.points) ? seriesEntry.points : [];
          const values = points.map((point) => Number(point.price)).filter((value) => Number.isFinite(value));
          const latest = points.length ? points[points.length - 1] : null;
          const previous = points.length > 1 ? points[points.length - 2] : null;
          const delta = latest && previous ? latest.price - previous.price : 0;
          const deltaLabel =
            delta === 0 ? "No move" : delta > 0 ? `Up ${delta.toFixed(2)}` : `Down ${Math.abs(delta).toFixed(2)}`;
          const deltaClass = delta > 0 ? "good" : delta < 0 ? "warn" : "";
          const recentPoints = points.slice(-5).reverse();
          const recentRows = recentPoints
            .map((point) => {
              return `
                <div class="history-point">
                  <div class="meta">${formatDateTime(point.recorded_at)}</div>
                  <div class="badge">${formatPrice(point.price)}</div>
                </div>
              `;
            })
            .join("");
          return `
            <div class="history-series">
              <div class="history-series-head">
                <div>
                  <div class="event-title">${escapeHtml(seriesEntry.bookmaker.name)}</div>
                  <div class="meta">${latest ? `Last update ${formatDateTime(latest.recorded_at)}` : "No updates"}</div>
                </div>
                <div class="badge ${deltaClass}">${deltaLabel}</div>
              </div>
              ${buildSparkline(values)}
              <div class="history-points">${recentRows || "<div class=\"meta\">No recent ticks</div>"}</div>
            </div>
          `;
        })
        .join("");
      return `
        <div class="data-card history-outcome">
          <div class="history-outcome-title">${escapeHtml(outcome.label || "Outcome")}</div>
          <div class="history-grid">${seriesCards}</div>
        </div>
      `;
    })
    .join("");

  dom.historyContent.innerHTML = cards;
}

async function loadOddsHistory(outcomeId, options = {}) {
  const { force = false } = options;
  if (!outcomeId || (state.oddsHistoryLoading && !force)) {
    return;
  }
  state.oddsHistoryLoading = true;
  state.oddsHistoryOutcomeId = outcomeId;
  const lookbackHours = getHistoryLookbackHours();
  state.oddsHistoryLookbackHours = lookbackHours;
  const maxPoints = getHistoryMaxPoints();
  state.oddsHistoryMaxPoints = maxPoints;
  if (dom.historyContent) {
    dom.historyContent.innerHTML = "<div class=\"meta loading\">Loading odds history...</div>";
  }
  try {
    const data = await fetchJson("/odds/history", {
      outcome_id: outcomeId,
      lookback_hours: lookbackHours,
      max_points: maxPoints,
    });
    if (state.oddsHistoryOutcomeId !== outcomeId) {
      return;
    }
    state.oddsHistoryPayload = data;
    renderOddsHistory(data);
  } catch (err) {
    if (state.oddsHistoryOutcomeId === outcomeId && dom.historyContent) {
      dom.historyContent.innerHTML = "<div class=\"data-card\">Failed to load odds history.</div>";
    }
  } finally {
    if (state.oddsHistoryOutcomeId === outcomeId) {
      state.oddsHistoryLoading = false;
    }
  }
}

async function loadMarketHistory(marketId, options = {}) {
  const { force = false } = options;
  if (!marketId || (state.oddsHistoryLoading && !force)) {
    return;
  }
  state.oddsHistoryLoading = true;
  state.oddsHistoryMarketId = marketId;
  const lookbackHours = getHistoryLookbackHours();
  const maxPoints = getHistoryMaxPoints();
  state.oddsHistoryLookbackHours = lookbackHours;
  state.oddsHistoryMaxPoints = maxPoints;
  if (dom.historyContent) {
    dom.historyContent.innerHTML = "<div class=\"meta loading\">Loading market history...</div>";
  }
  try {
    const data = await fetchJson("/odds/history/market", {
      market_id: marketId,
      lookback_hours: lookbackHours,
      max_points: maxPoints,
    });
    if (state.oddsHistoryMarketId !== marketId) {
      return;
    }
    state.oddsHistoryPayload = data;
    renderMarketHistory(data);
  } catch (err) {
    if (state.oddsHistoryMarketId === marketId && dom.historyContent) {
      dom.historyContent.innerHTML = "<div class=\"data-card\">Failed to load market history.</div>";
    }
  } finally {
    if (state.oddsHistoryMarketId === marketId) {
      state.oddsHistoryLoading = false;
    }
  }
}

function updateHistoryMeta(context) {
  if (!context || !dom.historyMeta) {
    return;
  }
  const market = context.market;
  const event = context.event;
  const lookbackLabel = formatLookbackLabel(getHistoryLookbackHours());
  const maxPoints = getHistoryMaxPoints();
  const lineText = market.line !== null && market.line !== undefined ? `Line ${market.line}` : "";
  const roundText =
    market.round_number !== null && market.round_number !== undefined ? `Round ${market.round_number}` : "";
  const teamSide = market.team_side ? `Side ${market.team_side}` : "";
  const metaBits = [lineText, roundText, teamSide].filter(Boolean).join(" | ");
  const lookbackText = lookbackLabel ? ` | Lookback ${lookbackLabel}` : "";
  const maxText = Number.isFinite(maxPoints) ? ` | Max points ${maxPoints}` : "";
  dom.historyMeta.textContent = `${event.home_team} vs ${event.away_team} | ${event.league} | ${formatDateTime(
    event.start_time
  )} | ${market.market_key} | ${market.period}${metaBits ? ` | ${metaBits}` : ""}${lookbackText}${maxText}`;
}

function openOddsHistory(outcomeId) {
  if (!outcomeId || !dom.historyModal) {
    return;
  }
  const context = state.oddsOutcomeContext.get(outcomeId);
  if (!context) {
    showToast("Odds history unavailable");
    return;
  }
  state.oddsHistoryMode = "outcome";
  state.oddsHistoryOutcomeId = outcomeId;
  state.oddsHistoryMarketId = null;
  if (dom.historyLookback) {
    dom.historyLookback.value = String(state.oddsHistoryLookbackHours);
  }
  if (dom.historyMaxPoints) {
    dom.historyMaxPoints.value = String(state.oddsHistoryMaxPoints);
  }
  if (dom.historyTitle) {
    dom.historyTitle.textContent = context.outcome.label || "Odds history";
  }
  updateHistoryMeta(context);
  showHistoryModal();
  loadOddsHistory(outcomeId);
}

function openMarketHistory(marketId) {
  if (!marketId || !dom.historyModal) {
    return;
  }
  const context = state.oddsMarketContext.get(marketId);
  if (!context) {
    showToast("Market history unavailable");
    return;
  }
  state.oddsHistoryMode = "market";
  state.oddsHistoryMarketId = marketId;
  state.oddsHistoryOutcomeId = null;
  if (dom.historyLookback) {
    dom.historyLookback.value = String(state.oddsHistoryLookbackHours);
  }
  if (dom.historyMaxPoints) {
    dom.historyMaxPoints.value = String(state.oddsHistoryMaxPoints);
  }
  if (dom.historyTitle) {
    dom.historyTitle.textContent = `${context.market.market_key} | ${context.market.period} movement`;
  }
  updateHistoryMeta(context);
  showHistoryModal();
  loadMarketHistory(marketId);
}

function startOddsScreenStream() {
  if (!window.EventSource || oddsScreenStream || !state.oddsScreenAutoRefreshEnabled) {
    return;
  }
  oddsScreenStream = new EventSource("/odds/screen/stream");
  oddsScreenStreamConnected = false;
  updateLiveBadge();
  oddsScreenStream.addEventListener("open", () => {
    oddsScreenStreamConnected = true;
    updateLiveBadge();
  });
  oddsScreenStream.addEventListener("error", () => {
    oddsScreenStreamConnected = false;
    updateLiveBadge();
  });
  oddsScreenStream.addEventListener("tick", handleOddsScreenTick);
  updateLiveBadge();
}

function stopOddsScreenStream() {
  if (!oddsScreenStream) {
    return;
  }
  oddsScreenStream.removeEventListener("tick", handleOddsScreenTick);
  oddsScreenStream.close();
  oddsScreenStream = null;
  oddsScreenStreamConnected = false;
  updateLiveBadge();
}

function stopArbSearchAutoRefresh() {
  if (!arbSearchRefreshTimer) {
    return;
  }
  window.clearInterval(arbSearchRefreshTimer);
  arbSearchRefreshTimer = null;
}

function startArbSearchAutoRefresh() {
  stopArbSearchAutoRefresh();
  if (state.activeTab !== "arb-search" || !state.arbSearchAutoRefreshEnabled) {
    return;
  }
  const interval = Math.max(5000, Number(state.arbSearchRefreshIntervalMs) || 15000);
  arbSearchRefreshTimer = window.setInterval(() => {
    if (state.activeTab !== "arb-search" || !state.arbSearchAutoRefreshEnabled || state.arbSearchLoading) {
      return;
    }
    loadArbSearch({ reset: true });
  }, interval);
}

function handleOddsScreenTick() {
  if (state.activeTab !== "odds") {
    return;
  }
  if (document.hidden) {
    return;
  }
  if (state.oddsScreenLoading) {
    return;
  }
  const now = Date.now();
  if (now - oddsScreenStreamLastRefresh < ODDS_STREAM_MIN_INTERVAL_MS) {
    return;
  }
  oddsScreenStreamLastRefresh = now;
  const targetLimit = Math.max(state.oddsScreenOffset, state.oddsScreenLimit);
  loadOddsScreen({
    reset: true,
    limitOverride: targetLimit,
    offsetOverride: 0,
    showLoader: false,
    announce: false,
  });
}

function updateOddsLoadMeta() {
  if (state.activeTab !== "odds") {
    dom.oddsLoadMeta.textContent = "";
    dom.oddsLoadMeta.style.display = "none";
    dom.oddsLoadMeta.classList.remove("loading");
    updateOddsWarning();
    return;
  }
  if (state.oddsScreenTotalsLoading) {
    dom.oddsLoadMeta.textContent = "Updating totals...";
    dom.oddsLoadMeta.style.display = "block";
    dom.oddsLoadMeta.classList.add("loading");
    updateOddsWarning();
    return;
  }
  dom.oddsLoadMeta.classList.remove("loading");
  const totalRows = Number.isFinite(state.oddsScreenTotalRows) ? state.oddsScreenTotalRows : null;
  if (totalRows === null) {
    dom.oddsLoadMeta.textContent = "";
    dom.oddsLoadMeta.style.display = "none";
    updateOddsWarning();
    return;
  }
  const filtered = dom.toggleOnlySelected && dom.toggleOnlySelected.checked && state.selectedEvent;
  const bookmakerFiltered = !state.bookmakerFilterAll;
  const visibleRows = getVisibleOddsRows().length;
  const clamped = Math.min(visibleRows, totalRows);
  const capNote = state.oddsScreenIsCapped ? ` Results capped at ${totalRows}.` : "";
  const filterNote = filtered ? " Filtered to selected event." : "";
  const bookNote = bookmakerFiltered ? " Bookmakers filtered." : "";
  if (!state.oddsScreenHasMore) {
    dom.oddsLoadMeta.textContent = `All rows loaded (${totalRows}).${capNote}${filterNote}${bookNote}`;
  } else {
    dom.oddsLoadMeta.textContent = `Showing ${clamped} of ${totalRows}.${capNote}${filterNote}${bookNote}`;
  }
  dom.oddsLoadMeta.style.display = "block";
  updateOddsWarning();
}

function updateOddsWarning() {
  if (!dom.oddsWarning) {
    return;
  }
  if (state.activeTab !== "odds" || !state.oddsScreenWarning) {
    dom.oddsWarning.textContent = "";
    dom.oddsWarning.classList.remove("show");
    return;
  }
  dom.oddsWarning.textContent = state.oddsScreenWarning;
  dom.oddsWarning.classList.add("show");
}

function getVisibleOddsRows() {
  const rows = Array.isArray(state.oddsScreen.rows) ? state.oddsScreen.rows : [];
  if (!dom.toggleOnlySelected || !dom.toggleOnlySelected.checked) {
    return rows;
  }
  if (!state.selectedEvent) {
    return [];
  }
  return rows.filter((row) => row.event && row.event.id === state.selectedEvent.id);
}

function matchesBookmakerFilter(bookmakerId) {
  if (state.bookmakerFilterAll) {
    return true;
  }
  if (bookmakerId === null || bookmakerId === undefined) {
    return false;
  }
  return state.selectedBookmakerIds.has(bookmakerId);
}

function arbMatchesBookmakerFilter(arb) {
  if (state.bookmakerFilterAll) {
    return true;
  }
  if (!arb || !Array.isArray(arb.outcomes)) {
    return false;
  }
  return arb.outcomes.every((outcome) => matchesBookmakerFilter(outcome?.bookmaker?.id));
}

function arbSearchHasBookmakerSelection() {
  return !state.bookmakerFilterAll && state.selectedBookmakerIds instanceof Set && state.selectedBookmakerIds.size > 0;
}

function arbSearchMatchesBookmakerFilter(arb) {
  if (!arbSearchHasBookmakerSelection()) {
    return true;
  }
  if (!arb || !Array.isArray(arb.outcomes)) {
    return false;
  }
  const mode = state.arbSearchBookmakerMode || "include_selected";
  if (mode === "exclude_selected") {
    return arb.outcomes.every((outcome) => !state.selectedBookmakerIds.has(outcome?.bookmaker?.id));
  }
  return arb.outcomes.every((outcome) => state.selectedBookmakerIds.has(outcome?.bookmaker?.id));
}

function getArbSearchMaxAgeClamp() {
  const value = Number(state.arbSearchMaxAgeSeconds);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return Math.floor(value);
}

function arbSearchMatchesMaxAge(arb) {
  const maxAge = getArbSearchMaxAgeClamp();
  if (!Number.isFinite(maxAge)) {
    return true;
  }
  const outcomes = Array.isArray(arb?.outcomes) ? arb.outcomes : [];
  if (!outcomes.length) {
    return false;
  }
  return outcomes.every((outcome) => {
    const age = getArbOutcomeAgeSeconds(outcome);
    return Number.isFinite(age) && age <= maxAge;
  });
}

function evMatchesBookmakerFilter(pick) {
  if (state.bookmakerFilterAll) {
    return true;
  }
  return matchesBookmakerFilter(pick?.bookmaker?.id);
}

function getVisibleArbSearch() {
  const search = getSearchTerm();
  const data = Array.isArray(state.arbSearch) ? state.arbSearch : [];
  return data.filter(
    (item) =>
      eventMatchesSearch(item.event, search) &&
      arbSearchMatchesBookmakerFilter(item) &&
      arbSearchMatchesMaxAge(item)
  );
}

function getVisibleLowHoldSearch() {
  const search = getSearchTerm();
  const data = Array.isArray(state.lowHoldSearch) ? state.lowHoldSearch : [];
  return data.filter((item) => eventMatchesSearch(item.event, search) && arbMatchesBookmakerFilter(item));
}

function getVisibleEvSearch() {
  const search = getSearchTerm();
  const data = Array.isArray(state.evSearch) ? state.evSearch : [];
  return data.filter((item) => eventMatchesSearch(item.event, search) && evMatchesBookmakerFilter(item));
}

function updateArbSearchMeta() {
  if (!dom.arbSearchMeta) {
    return;
  }
  if (state.arbSearchLoading) {
    dom.arbSearchMeta.textContent = "Loading opportunities...";
    dom.arbSearchMeta.style.display = "block";
    dom.arbSearchMeta.classList.add("loading");
    return;
  }
  dom.arbSearchMeta.classList.remove("loading");
  const loaded = state.arbSearch.length;
  const visible = getVisibleArbSearch().length;
  if (loaded === 0) {
    dom.arbSearchMeta.textContent = "No opportunities loaded.";
  } else {
    const filterNote = visible !== loaded ? ` (${visible} after filters)` : "";
    const moreNote = state.arbSearchHasMore ? " Load more to continue." : "";
    dom.arbSearchMeta.textContent = `Loaded ${loaded} opportunities${filterNote}.${moreNote}`;
  }
  dom.arbSearchMeta.style.display = "block";
  if (dom.arbSearchLoadMore) {
    dom.arbSearchLoadMore.style.display =
      state.activeTab === "arb-search" && state.arbSearchHasMore ? "inline-flex" : "none";
  }
}

function updateLowHoldMeta() {
  if (!dom.lowHoldMeta) {
    return;
  }
  if (state.lowHoldSearchLoading) {
    dom.lowHoldMeta.textContent = "Loading low hold markets...";
    dom.lowHoldMeta.style.display = "block";
    dom.lowHoldMeta.classList.add("loading");
    return;
  }
  dom.lowHoldMeta.classList.remove("loading");
  const loaded = state.lowHoldSearch.length;
  const visible = getVisibleLowHoldSearch().length;
  if (loaded === 0) {
    dom.lowHoldMeta.textContent = "No low hold markets loaded.";
  } else {
    const filterNote = visible !== loaded ? ` (${visible} after filters)` : "";
    const moreNote = state.lowHoldSearchHasMore ? " Load more to continue." : "";
    dom.lowHoldMeta.textContent = `Loaded ${loaded} markets${filterNote}.${moreNote}`;
  }
  dom.lowHoldMeta.style.display = "block";
  if (dom.lowHoldLoadMore) {
    dom.lowHoldLoadMore.style.display =
      state.activeTab === "low-hold" && state.lowHoldSearchHasMore ? "inline-flex" : "none";
  }
}

function updateEvSearchMeta() {
  if (!dom.evSearchMeta) {
    return;
  }
  if (state.evSearchLoading) {
    dom.evSearchMeta.textContent = "Loading EV picks...";
    dom.evSearchMeta.style.display = "block";
    dom.evSearchMeta.classList.add("loading");
    return;
  }
  dom.evSearchMeta.classList.remove("loading");
  const loaded = state.evSearch.length;
  const visible = getVisibleEvSearch().length;
  if (loaded === 0) {
    dom.evSearchMeta.textContent = "No EV picks loaded.";
  } else {
    const filterNote = visible !== loaded ? ` (${visible} after filters)` : "";
    const moreNote = state.evSearchHasMore ? " Load more to continue." : "";
    dom.evSearchMeta.textContent = `Loaded ${loaded} picks${filterNote}.${moreNote}`;
  }
  dom.evSearchMeta.style.display = "block";
  if (dom.evSearchLoadMore) {
    dom.evSearchLoadMore.style.display =
      state.activeTab === "ev-search" && state.evSearchHasMore ? "inline-flex" : "none";
  }
}

async function loadBookmakers() {
  try {
    const data = await fetchJson("/bookmakers");
    state.bookmakers = Array.isArray(data) ? data : [];
    renderBookmakers();
  } catch (err) {
    if (dom.bookmakerFilters) {
      dom.bookmakerFilters.innerHTML = "<div class=\"meta\">Failed to load bookmakers</div>";
    }
  }
}

function renderBookmakers() {
  if (!dom.bookmakerFilters) {
    return;
  }
  if (!state.bookmakers.length) {
    dom.bookmakerFilters.innerHTML = "<div class=\"meta\">No bookmakers</div>";
    return;
  }
  dom.bookmakerFilters.innerHTML = "";
  const allLabel = document.createElement("label");
  allLabel.className = "checkbox-item";
  const allInput = document.createElement("input");
  allInput.type = "checkbox";
  allInput.value = "";
  allInput.dataset.role = "all";
  allInput.checked = state.bookmakerFilterAll;
  allInput.addEventListener("change", () => {
    state.bookmakerFilterAll = allInput.checked;
    if (state.bookmakerFilterAll) {
      state.selectedBookmakerIds = new Set();
    }
    renderBookmakers();
    renderOddsScreen();
    renderArbSearch();
    renderEvSearch();
    refreshBookmakerScopedData();
  });
  const allSpan = document.createElement("span");
  allSpan.textContent = "All bookmakers";
  allLabel.appendChild(allInput);
  allLabel.appendChild(allSpan);
  dom.bookmakerFilters.appendChild(allLabel);

  state.bookmakers.forEach((book) => {
    const label = document.createElement("label");
    label.className = "checkbox-item";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = String(book.id);
    input.checked = isBookmakerSelected(book.id);
    input.addEventListener("change", updateBookmakerSelectionFromUI);
    const span = document.createElement("span");
    span.textContent = book.name;
    label.appendChild(input);
    label.appendChild(span);
    dom.bookmakerFilters.appendChild(label);
  });
}

function updateBookmakerSelectionFromUI() {
  if (!dom.bookmakerFilters) {
    return;
  }
  const selected = new Set();
  const inputs = dom.bookmakerFilters.querySelectorAll("input[type=\"checkbox\"]");
  inputs.forEach((input) => {
    if (input.dataset.role === "all") {
      return;
    }
    if (input.value && input.checked) {
      selected.add(Number(input.value));
    }
  });
  const totalBooks = state.bookmakers.length;
  if (selected.size === totalBooks) {
    state.bookmakerFilterAll = true;
    state.selectedBookmakerIds = new Set();
  } else {
    state.bookmakerFilterAll = false;
    state.selectedBookmakerIds = selected;
  }
  renderBookmakers();
  renderOddsScreen();
  renderArbSearch();
  renderEvSearch();
  refreshBookmakerScopedData();
  if (state.oddsHistoryPayload && dom.historyModal && dom.historyModal.classList.contains("show")) {
    if (state.oddsHistoryMode === "market") {
      renderMarketHistory(state.oddsHistoryPayload);
    } else {
      renderOddsHistory(state.oddsHistoryPayload);
    }
  }
}

function refreshBookmakerScopedData() {
  loadFilterMeta();
  if (state.activeTab === "odds") {
    loadOddsScreen({ reset: true });
    return;
  }
  if (state.activeTab === "arb") {
    loadArbitrage();
    return;
  }
  if (state.activeTab === "ev") {
    loadPositiveEv();
    return;
  }
  if (state.activeTab === "arb-search") {
    loadArbSearch({ reset: true });
    return;
  }
  if (state.activeTab === "low-hold") {
    loadLowHoldSearch({ reset: true });
    return;
  }
  if (state.activeTab === "ev-search") {
    loadEvSearch({ reset: true });
  }
}

async function loadPresetsFromServer() {
  try {
    const data = await fetchJson("/presets");
    state.presets = Array.isArray(data) ? data : [];
  } catch (err) {
    state.presets = [];
    showToast("Failed to load presets");
  }
  renderPresetOptions();
}

function uniquePresetName(baseName) {
  const base = baseName || "Shared preset";
  const names = new Set(state.presets.map((preset) => preset.name));
  if (!names.has(base)) {
    return base;
  }
  let idx = 1;
  while (names.has(`${base} (${idx})`)) {
    idx += 1;
  }
  return `${base} (${idx})`;
}

function extractPresetPayload(data) {
  if (!data || typeof data !== "object") {
    return null;
  }
  if (data.payload && typeof data.payload === "object") {
    return data.payload;
  }
  if (data.filters && typeof data.filters === "object") {
    const payload = { filters: data.filters };
    if (data.history && typeof data.history === "object") {
      payload.history = data.history;
    }
    return payload;
  }
  return null;
}

function renderPresetOptions() {
  if (!dom.presetSelect) {
    return;
  }
  dom.presetSelect.innerHTML = "<option value=\"\">Select preset</option>";
  state.presets.forEach((preset) => {
    const option = document.createElement("option");
    option.value = String(preset.id);
    option.textContent = preset.name;
    dom.presetSelect.appendChild(option);
  });
}

function upsertPresetInState(saved) {
  if (!saved) {
    return;
  }
  const index = state.presets.findIndex((item) => item.id === saved.id);
  if (index >= 0) {
    state.presets[index] = saved;
  } else {
    state.presets.push(saved);
  }
  renderPresetOptions();
}

function buildPresetFromUI(name) {
  const minArbRaw = dom.filterMinArb && dom.filterMinArb.value !== "" ? Number(dom.filterMinArb.value) : null;
  const maxOverroundRaw =
    dom.filterMaxOverround && dom.filterMaxOverround.value !== "" ? Number(dom.filterMaxOverround.value) : null;
  const minEvRaw = dom.filterMinEv && dom.filterMinEv.value !== "" ? Number(dom.filterMinEv.value) : null;
  return {
    name,
    filters: {
      sport: dom.filterSport.value.trim(),
      league: dom.filterLeague.value.trim(),
      start_after: getIsoFromLocalInput(dom.filterStartAfter),
      start_before: getIsoFromLocalInput(dom.filterStartBefore),
      market_key: dom.filterMarketKey.value.trim(),
      period: dom.filterPeriod.value.trim(),
      min_arb: Number.isFinite(minArbRaw) ? minArbRaw : null,
      max_overround: Number.isFinite(maxOverroundRaw) ? maxOverroundRaw : null,
      min_ev: Number.isFinite(minEvRaw) ? minEvRaw : null,
      include_negative: dom.toggleIncludeNegative ? dom.toggleIncludeNegative.checked : false,
      allow_single_book: dom.toggleAllowSingleBook ? dom.toggleAllowSingleBook.checked : false,
      include_stale: dom.toggleIncludeStale ? dom.toggleIncludeStale.checked : false,
      include_unhealthy: dom.toggleIncludeUnhealthy ? dom.toggleIncludeUnhealthy.checked : false,
      bookmaker_filter_all: state.bookmakerFilterAll,
      bookmaker_ids: Array.from(state.selectedBookmakerIds),
      only_selected: dom.toggleOnlySelected ? dom.toggleOnlySelected.checked : false,
      auto_refresh: dom.toggleAutoRefresh ? dom.toggleAutoRefresh.checked : true,
    },
    history: {
      lookback_hours: state.oddsHistoryLookbackHours,
      max_points: state.oddsHistoryMaxPoints,
    },
  };
}

function applyPreset(preset) {
  const filters = preset?.filters || preset?.payload?.filters;
  const history = preset?.history || preset?.payload?.history;
  if (!filters) {
    return;
  }
  dom.filterSport.value = filters.sport || "";
  dom.filterLeague.value = filters.league || "";
  dom.filterStartAfter.value = toLocalInputValue(filters.start_after);
  dom.filterStartBefore.value = toLocalInputValue(filters.start_before);
  dom.filterMarketKey.value = filters.market_key || "";
  dom.filterPeriod.value = filters.period || "";
  if (dom.filterMinArb) {
    dom.filterMinArb.value = filters.min_arb ?? "";
  }
  if (dom.filterMaxOverround) {
    dom.filterMaxOverround.value = filters.max_overround ?? "";
  }
  if (dom.filterMinEv) {
    dom.filterMinEv.value = filters.min_ev ?? "";
  }
  if (dom.toggleIncludeNegative) {
    dom.toggleIncludeNegative.checked = Boolean(filters.include_negative);
  }
  if (dom.toggleAllowSingleBook) {
    dom.toggleAllowSingleBook.checked = Boolean(filters.allow_single_book);
  }
  if (dom.toggleIncludeStale) {
    dom.toggleIncludeStale.checked = Boolean(filters.include_stale);
  }
  if (dom.toggleIncludeUnhealthy) {
    dom.toggleIncludeUnhealthy.checked = Boolean(filters.include_unhealthy);
  }
  state.bookmakerFilterAll = filters.bookmaker_filter_all !== false;
  state.selectedBookmakerIds = new Set(filters.bookmaker_ids || []);
  renderBookmakers();
  if (dom.toggleOnlySelected) {
    dom.toggleOnlySelected.checked = Boolean(filters.only_selected);
  }
  if (dom.toggleAutoRefresh) {
    dom.toggleAutoRefresh.checked = filters.auto_refresh !== false;
    state.oddsScreenAutoRefreshEnabled = dom.toggleAutoRefresh.checked;
  }
  if (history && typeof history === "object") {
    if (Number.isFinite(history.lookback_hours) && history.lookback_hours > 0) {
      state.oddsHistoryLookbackHours = history.lookback_hours;
    }
    if (Number.isFinite(history.max_points) && history.max_points > 0) {
      state.oddsHistoryMaxPoints = history.max_points;
    }
    if (dom.historyLookback) {
      dom.historyLookback.value = String(state.oddsHistoryLookbackHours);
    }
    if (dom.historyMaxPoints) {
      dom.historyMaxPoints.value = String(state.oddsHistoryMaxPoints);
    }
    if (state.oddsHistoryMode === "market" && state.oddsHistoryMarketId) {
      const context = state.oddsMarketContext.get(state.oddsHistoryMarketId);
      updateHistoryMeta(context);
      loadMarketHistory(state.oddsHistoryMarketId, { force: true });
    } else if (state.oddsHistoryOutcomeId) {
      const context = state.oddsOutcomeContext.get(state.oddsHistoryOutcomeId);
      updateHistoryMeta(context);
      loadOddsHistory(state.oddsHistoryOutcomeId, { force: true });
    }
  }
  updateLiveBadge();
  if (state.activeTab === "odds") {
    if (state.oddsScreenAutoRefreshEnabled) {
      startOddsScreenStream();
    } else {
      stopOddsScreenStream();
    }
  }
  loadFilterMeta();
  loadEvents(true).then(() => {
    loadOddsScreen({ reset: true });
    if (state.activeTab === "arb-search") {
      loadArbSearch({ reset: true });
    }
    if (state.activeTab === "low-hold") {
      loadLowHoldSearch({ reset: true });
    }
    if (state.activeTab === "ev-search") {
      loadEvSearch({ reset: true });
    }
  });
}

function savePresetFromUI() {
  const name = dom.presetName.value.trim();
  if (!name) {
    showToast("Preset name required");
    return;
  }
  const selectedId = Number(dom.presetSelect.value || 0) || null;
  const preset = buildPresetFromUI(name);
  const payload = { id: selectedId, name: preset.name, payload: { filters: preset.filters, history: preset.history } };
  requestJson("/presets", "POST", payload)
    .then((saved) => {
      upsertPresetInState(saved);
      dom.presetSelect.value = String(saved.id);
      showToast("Preset saved");
    })
    .catch(() => showToast("Failed to save preset"));
}

function applySelectedPreset() {
  const selectedId = Number(dom.presetSelect.value || 0);
  if (!selectedId) {
    showToast("Select a preset");
    return;
  }
  const preset = state.presets.find((item) => item.id === selectedId);
  if (!preset) {
    showToast("Preset not found");
    return;
  }
  applyPreset(preset.payload || preset);
}

function deleteSelectedPreset() {
  const selectedId = Number(dom.presetSelect.value || 0);
  if (!selectedId) {
    showToast("Select a preset");
    return;
  }
  requestJson(`/presets/${selectedId}`, "DELETE")
    .then(() => {
      state.presets = state.presets.filter((item) => item.id !== selectedId);
      renderPresetOptions();
      dom.presetSelect.value = "";
      dom.presetName.value = "";
      showToast("Preset deleted");
    })
    .catch(() => showToast("Failed to delete preset"));
}

function getSelectedPreset() {
  const selectedId = Number(dom.presetSelect.value || 0);
  if (!selectedId) {
    return null;
  }
  return state.presets.find((item) => item.id === selectedId) || null;
}

async function shareSelectedPreset() {
  const preset = getSelectedPreset();
  if (!preset) {
    showToast("Select a preset");
    return;
  }
  try {
    const data = await requestJson(`/presets/${preset.id}/share`, "POST");
    const token = data?.share_token;
    if (!token) {
      showToast("Share token unavailable");
      return;
    }
    const url = `${window.location.origin}${window.location.pathname}?preset_token=${encodeURIComponent(token)}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      showToast("Share link copied");
    } else {
      window.prompt("Copy this link", url);
    }
  } catch (err) {
    showToast("Failed to share preset");
  }
}

function exportSelectedPreset() {
  const preset = getSelectedPreset();
  if (!preset) {
    showToast("Select a preset");
    return;
  }
  const exportPayload = {
    name: preset.name,
    payload: preset.payload,
  };
  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${preset.name.replace(/\\s+/g, "_").toLowerCase() || "preset"}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast("Preset exported");
}

async function importPreset() {
  const raw = window.prompt("Paste preset JSON");
  if (!raw) {
    return;
  }
  try {
    const data = JSON.parse(raw);
    const name = (data.name || "").trim();
    const payload = extractPresetPayload(data);
    if (!payload || !payload.filters) {
      showToast("Invalid preset format");
      return;
    }
    const presetName = uniquePresetName(name || dom.presetName.value.trim() || "Imported preset");
    const saved = await requestJson("/presets", "POST", {
      name: presetName,
      payload,
    });
    upsertPresetInState(saved);
    dom.presetSelect.value = String(saved.id);
    dom.presetName.value = saved.name;
    applyPreset(saved.payload || saved);
    showToast("Preset imported");
  } catch (err) {
    showToast("Failed to import preset");
  }
}

async function loadAlertsFromServer() {
  try {
    const data = await fetchJson("/alerts");
    state.alerts = Array.isArray(data) ? data : [];
  } catch (err) {
    state.alerts = [];
    showToast("Failed to load alerts");
  }
  renderAlertOptions();
}

function renderAlertOptions() {
  if (!dom.alertSelect) {
    return;
  }
  dom.alertSelect.innerHTML = "<option value=\"\">Select alert</option>";
  state.alerts.forEach((alert) => {
    const option = document.createElement("option");
    option.value = String(alert.id);
    option.textContent = alert.name;
    dom.alertSelect.appendChild(option);
  });
}

function upsertAlertInState(saved) {
  if (!saved) {
    return;
  }
  const index = state.alerts.findIndex((item) => item.id === saved.id);
  if (index >= 0) {
    state.alerts[index] = saved;
  } else {
    state.alerts.push(saved);
  }
  renderAlertOptions();
}

function getSelectedAlert() {
  const selectedId = Number(dom.alertSelect?.value || 0);
  if (!selectedId) {
    return null;
  }
  return state.alerts.find((item) => item.id === selectedId) || null;
}

function buildAlertPayload(name) {
  const preset = buildPresetFromUI(name);
  return {
    filters: preset.filters,
    limit: state.alertHitsLimit,
  };
}

function saveAlertFromUI() {
  const name = dom.alertName.value.trim();
  if (!name) {
    showToast("Alert name required");
    return;
  }
  const selectedId = Number(dom.alertSelect.value || 0) || null;
  const alertType = dom.alertType.value || "arbitrage";
  const payload = buildAlertPayload(name);
  requestJson("/alerts", "POST", {
    id: selectedId,
    name,
    alert_type: alertType,
    is_active: true,
    payload,
  })
    .then((saved) => {
      upsertAlertInState(saved);
      dom.alertSelect.value = String(saved.id);
      dom.alertName.value = saved.name;
      dom.alertType.value = saved.alert_type;
      showToast("Alert saved");
      if (state.activeTab === "alerts") {
        loadAlertHits();
      }
    })
    .catch(() => showToast("Failed to save alert"));
}

function deleteSelectedAlert() {
  const selectedId = Number(dom.alertSelect.value || 0);
  if (!selectedId) {
    showToast("Select an alert");
    return;
  }
  requestJson(`/alerts/${selectedId}`, "DELETE")
    .then(() => {
      state.alerts = state.alerts.filter((item) => item.id !== selectedId);
      renderAlertOptions();
      dom.alertSelect.value = "";
      dom.alertName.value = "";
      showToast("Alert deleted");
      if (state.activeTab === "alerts") {
        loadAlertHits();
      }
    })
    .catch(() => showToast("Failed to delete alert"));
}

async function scanSelectedAlert() {
  const alert = getSelectedAlert();
  setAlertStatus("Scanning alerts...", true);
  try {
    if (alert) {
      const scanData = await requestJson(`/alerts/${alert.id}/scan`, "POST");
      setAlertStatus(
        `Scan complete: ${scanData.matches} matches (${scanData.hits_new} new).`,
        false
      );
      await loadAlertsFromServer();
      await loadAlertHits();
      return;
    }
    const scans = await requestJson("/alerts/scan", "POST");
    const scanned = Array.isArray(scans) ? scans.length : 0;
    setAlertStatus(`Scanned ${scanned} alert(s).`, false);
    await loadAlertsFromServer();
  } catch (err) {
    setAlertStatus("Alert scan failed.", false);
  }
}

async function loadAlertHits() {
  if (!dom.alertsView) {
    return;
  }
  const alert = getSelectedAlert();
  if (!alert) {
    state.alertHits = [];
    renderAlertsView();
    setAlertStatus("");
    return;
  }
  state.alertHitsLoading = true;
  renderLoading(dom.alertsView);
  setAlertStatus("Loading alert hits...", true);
  try {
    const data = await fetchJson(`/alerts/${alert.id}/hits`, { limit: state.alertHitsLimit });
    state.alertHits = Array.isArray(data) ? data : [];
    renderAlertsView();
    setAlertStatus(`Loaded ${state.alertHits.length} hit(s).`, false);
  } catch (err) {
    dom.alertsView.innerHTML = "<div class=\"data-card\">Failed to load alert hits.</div>";
    setAlertStatus("Failed to load alert hits.", false);
  } finally {
    state.alertHitsLoading = false;
  }
}

function renderAlertsView() {
  if (!dom.alertsView) {
    return;
  }
  const alert = getSelectedAlert();
  if (!alert) {
    dom.alertsView.innerHTML = "<div class=\"data-card\">Select an alert to view hits.</div>";
    return;
  }
  const hits = Array.isArray(state.alertHits) ? state.alertHits : [];
  if (!hits.length) {
    dom.alertsView.innerHTML = "<div class=\"data-card\">No hits yet. Run a scan to populate.</div>";
    return;
  }

  const searchTerm = getSearchTerm();
  const visible = hits.filter((hit) => {
    const payload = hit.payload || {};
    return eventMatchesSearch(payload.event, searchTerm);
  });
  if (!visible.length) {
    dom.alertsView.innerHTML = "<div class=\"data-card\">No hits match the search filter.</div>";
    return;
  }

  const cards = visible.map((hit) => {
    const payload = hit.payload || {};
    const event = payload.event || {};
    const market = payload.market || {};
    const metaBits = formatMarketBits(market);
    const seenText = hit.last_seen_at ? `Last seen ${formatDateTime(hit.last_seen_at)}` : "Recent";

    if (alert.alert_type === "positive_ev") {
      const evPct = Number(payload.expected_value) * 100;
      return `
        <div class="data-card">
          <div class="data-row">
            <div class="data-main">
              <div class="market-title">${escapeHtml(market.market_key || "")} | ${escapeHtml(market.period || "")}${
                metaBits ? ` | ${escapeHtml(metaBits)}` : ""
              }</div>
              <div class="meta">${escapeHtml(event.home_team || "")} vs ${escapeHtml(event.away_team || "")} | ${escapeHtml(
                event.league || ""
              )} | ${formatDateTime(event.start_time)}</div>
              <div class="meta">${escapeHtml(payload.outcome?.label || "")} | ${escapeHtml(
                payload.bookmaker?.name || ""
              )}</div>
              <div class="meta">${seenText}</div>
            </div>
            <div class="badge ${payload.is_positive ? "good" : "warn"}">${formatPercent(evPct)}</div>
          </div>
          <div class="data-row">
            <div class="data-main">
              <div class="meta">Price ${formatPrice(payload.price)}</div>
              <div class="meta">Fair prob ${(Number(payload.fair_probability || 0) * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      `;
    }

    const outcomes = Array.isArray(payload.outcomes) ? payload.outcomes : [];
    const outcomeRows = outcomes
      .map((outcome) => {
        return `
          <div class="data-row">
            <div class="data-main">
              <div class="event-title">${escapeHtml(outcome.label || "")}</div>
              <div class="meta">${escapeHtml(outcome.bookmaker?.name || "")}</div>
            </div>
            <div class="badge">${formatPrice(outcome.best_price)}</div>
          </div>
        `;
      })
      .join("");

    if (alert.alert_type === "low_hold") {
      const implied = Number(payload.total_implied_probability || 0);
      const holdPct = (implied - 1) * 100;
      const holdLabel = Number.isFinite(holdPct) ? `Hold +${formatPercent(holdPct)}` : "Hold";
      return `
        <div class="data-card">
          <div class="data-row">
            <div class="data-main">
              <div class="market-title">${escapeHtml(market.market_key || "")} | ${escapeHtml(market.period || "")}${
                metaBits ? ` | ${escapeHtml(metaBits)}` : ""
              }</div>
              <div class="meta">${escapeHtml(event.home_team || "")} vs ${escapeHtml(event.away_team || "")} | ${escapeHtml(
                event.league || ""
              )} | ${formatDateTime(event.start_time)}</div>
              <div class="meta">${seenText}</div>
            </div>
            <div class="badge warn">${holdLabel}</div>
          </div>
          ${outcomeRows}
        </div>
      `;
    }

    return `
      <div class="data-card">
        <div class="data-row">
          <div class="data-main">
            <div class="market-title">${escapeHtml(market.market_key || "")} | ${escapeHtml(market.period || "")}${
              metaBits ? ` | ${escapeHtml(metaBits)}` : ""
            }</div>
            <div class="meta">${escapeHtml(event.home_team || "")} vs ${escapeHtml(event.away_team || "")} | ${escapeHtml(
              event.league || ""
            )} | ${formatDateTime(event.start_time)}</div>
            <div class="meta">${seenText}</div>
          </div>
          <div class="badge good">${formatPercent(Number(payload.arb_percentage || 0))}</div>
        </div>
        ${outcomeRows}
      </div>
    `;
  });

  dom.alertsView.innerHTML = cards.join("");
}

function announceOddsScreenProgress() {
  const totalRows = Number.isFinite(state.oddsScreenTotalRows) ? state.oddsScreenTotalRows : null;
  const loadedRows = Array.isArray(state.oddsScreen.rows) ? state.oddsScreen.rows.length : 0;
  if (totalRows !== null) {
    const clamped = Math.min(loadedRows, totalRows);
    if (!state.oddsScreenHasMore) {
      const capNote = state.oddsScreenIsCapped ? ` Results capped at ${totalRows}.` : "";
      announceStatus(`Loaded all ${totalRows} rows.${capNote}`);
    } else {
      const capNote = state.oddsScreenIsCapped ? ` Results capped at ${totalRows}.` : "";
      announceStatus(`Loaded ${clamped} of ${totalRows} rows.${capNote}`);
    }
    return;
  }
  announceStatus(`Loaded ${loadedRows} rows.`);
}

function setOddsLoadMoreLoading(isLoading) {
  if (!dom.oddsLoadMore) {
    return;
  }
  dom.oddsLoadMore.disabled = isLoading;
  dom.oddsLoadMore.classList.toggle("loading", isLoading);
}

function setArbSearchLoadMoreLoading(isLoading) {
  if (!dom.arbSearchLoadMore) {
    return;
  }
  dom.arbSearchLoadMore.disabled = isLoading;
  dom.arbSearchLoadMore.classList.toggle("loading", isLoading);
}

function setLowHoldLoadMoreLoading(isLoading) {
  if (!dom.lowHoldLoadMore) {
    return;
  }
  dom.lowHoldLoadMore.disabled = isLoading;
  dom.lowHoldLoadMore.classList.toggle("loading", isLoading);
}

function setEvSearchLoadMoreLoading(isLoading) {
  if (!dom.evSearchLoadMore) {
    return;
  }
  dom.evSearchLoadMore.disabled = isLoading;
  dom.evSearchLoadMore.classList.toggle("loading", isLoading);
}

async function fetchJson(path, params) {
  const response = await fetch(`${path}${buildQuery(params || {})}`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }
  return response.json();
}

async function requestJson(path, method, body) {
  const response = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

async function requestJsonDetailed(path, options = {}) {
  const method = options.method || "GET";
  const params = options.params || undefined;
  const response = await fetch(`${path}${buildQuery(params || {})}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let payload = null;
  let text = "";
  const contentType = response.headers.get("content-type") || "";
  if (response.status !== 204) {
    if (contentType.includes("application/json")) {
      try {
        payload = await response.json();
      } catch (err) {
        payload = null;
      }
    } else {
      text = await response.text();
    }
  }

  if (!response.ok) {
    const detail =
      (payload && (payload.detail || payload.message)) ||
      text ||
      `Request failed: ${response.status}`;
    const error = new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

function setRunIngestStatus(message, tone = "") {
  if (!dom.runIngestStatus) {
    return;
  }
  dom.runIngestStatus.textContent = message || "";
  dom.runIngestStatus.classList.remove("status-running", "status-success", "status-failed", "status-warn");
  if (tone) {
    dom.runIngestStatus.classList.add(`status-${tone}`);
  }
  const visible = state.activeTab === "arb-search" && Boolean(message);
  dom.runIngestStatus.style.display = visible ? "inline-flex" : "none";
}

function syncRunIngestControls() {
  if (!dom.runIngestBtn) {
    return;
  }
  const show = state.activeTab === "arb-search";
  dom.runIngestBtn.style.display = show ? "inline-flex" : "none";
  dom.runIngestBtn.disabled = state.ingestTriggerInFlight;
  dom.runIngestBtn.classList.toggle("loading", state.ingestTriggerInFlight);
  dom.runIngestBtn.textContent = state.ingestTriggerInFlight
    ? (state.ingestTriggerRunId ? "Running..." : "Starting...")
    : "Run Ingest";
  if (dom.runIngestStatus) {
    const hasStatus = Boolean(dom.runIngestStatus.textContent);
    dom.runIngestStatus.style.display = show && hasStatus ? "inline-flex" : "none";
  }
}

function stopIngestTriggerPolling() {
  if (!state.ingestTriggerPollingTimer) {
    return;
  }
  window.clearTimeout(state.ingestTriggerPollingTimer);
  state.ingestTriggerPollingTimer = null;
}

function summarizeIngestTriggerProgress(status) {
  if (!status || typeof status !== "object") {
    return "";
  }
  const total = Number(status.bookmakers_total) || 0;
  const completed = Number(status.bookmakers_completed) || 0;
  const failed = Number(status.bookmakers_failed) || 0;
  const started = Number(status.bookmakers_started) || 0;
  const events = Number(status.events_ingested) || 0;
  const segments = [];
  if (total > 0) {
    segments.push(`${completed}/${total} books complete`);
  } else if (started > 0) {
    segments.push(`${started} books started`);
  }
  if (failed > 0) {
    segments.push(`${failed} failed`);
  }
  if (events > 0) {
    segments.push(`${events} events`);
  }
  return segments.join(" | ");
}

function setRunIngestRunningUi(status, prefix = "Running...") {
  state.ingestTriggerLastStatus = status || null;
  const progress = summarizeIngestTriggerProgress(status);
  setRunIngestStatus(progress ? `${prefix} ${progress}` : prefix, "running");
  syncRunIngestControls();
}

async function pollIngestTriggerStatus(runId) {
  if (!runId) {
    return;
  }
  try {
    const status = await requestJsonDetailed("/ingest/status", { params: { run_id: runId } });
    state.ingestTriggerLastStatus = status;
    state.ingestTriggerRunId = runId;
    if (!status || typeof status !== "object") {
      throw new Error("Invalid ingest status response");
    }
    if (status.is_terminal) {
      stopIngestTriggerPolling();
      state.ingestTriggerInFlight = false;
      const progress = summarizeIngestTriggerProgress(status);
      if (status.status === "succeeded") {
        setRunIngestStatus(progress ? `Succeeded. ${progress}` : "Succeeded.", "success");
        syncRunIngestControls();
        showToast("Ingest completed. Refreshing arb scanner...");
        await loadIngestHealth();
        await loadArbSearch({ reset: true });
      } else {
        const message = status.error_message || "Ingest failed";
        setRunIngestStatus(progress ? `Failed. ${progress}` : "Failed.", "failed");
        syncRunIngestControls();
        showToast(`Ingest failed: ${message}`);
      }
      return;
    }

    setRunIngestRunningUi(status, status.status === "queued" ? "Queued..." : "Running...");
  } catch (err) {
    if (err && err.status === 404) {
      stopIngestTriggerPolling();
      state.ingestTriggerInFlight = false;
      state.ingestTriggerRunId = null;
      setRunIngestStatus("Status unavailable (server restarted or run expired).", "warn");
      syncRunIngestControls();
      showToast("Ingest status unavailable");
      return;
    }
    setRunIngestStatus("Status check failed, retrying...", "warn");
    syncRunIngestControls();
  }

  stopIngestTriggerPolling();
  state.ingestTriggerPollingTimer = window.setTimeout(() => {
    pollIngestTriggerStatus(runId);
  }, 2000);
}

async function startIngestFromUi() {
  if (!dom.runIngestBtn || state.ingestTriggerInFlight) {
    return;
  }
  const confirmed = window.confirm("This will refresh odds. Continue?");
  if (!confirmed) {
    return;
  }

  state.ingestTriggerInFlight = true;
  state.ingestTriggerRunId = null;
  state.ingestTriggerLastStatus = null;
  setRunIngestStatus("Starting...", "running");
  syncRunIngestControls();

  try {
    const payload = await requestJsonDetailed("/ingest/start", { method: "POST" });
    if (!payload || !payload.run_id) {
      throw new Error("Invalid ingest start response");
    }
    state.ingestTriggerRunId = payload.run_id;
    const reused = Boolean(payload.reused_existing_run);
    setRunIngestRunningUi(payload, reused ? "Running... (already in progress)" : "Running...");
    stopIngestTriggerPolling();
    state.ingestTriggerPollingTimer = window.setTimeout(() => {
      pollIngestTriggerStatus(payload.run_id);
    }, 200);
  } catch (err) {
    state.ingestTriggerInFlight = false;
    state.ingestTriggerRunId = null;
    const message = err?.message || "Failed to start ingest";
    setRunIngestStatus(message, "failed");
    syncRunIngestControls();
    showToast(message);
  }
}

function debounce(fn, waitMs = 300) {
  let timer = null;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, waitMs);
  };
}

function renderDatalistOptions(list, options) {
  if (!list) {
    return;
  }
  list.innerHTML = "";
  const rows = Array.isArray(options) ? options : [];
  rows.forEach((option) => {
    if (!option) {
      return;
    }
    const value = typeof option === "string" ? option : option.value;
    if (!value) {
      return;
    }
    const element = document.createElement("option");
    element.value = value;
    if (typeof option === "object" && Number.isFinite(option.count)) {
      element.label = `${value} (${option.count})`;
    }
    list.appendChild(element);
  });
}

function updateFilterMeta(meta) {
  if (!meta) {
    return;
  }
  renderDatalistOptions(dom.sportOptions, meta.sports);
  renderDatalistOptions(dom.leagueOptions, meta.leagues);
  renderDatalistOptions(dom.marketOptions, meta.market_keys);
  renderDatalistOptions(dom.periodOptions, meta.periods);
  renderDatalistOptions(dom.teamOptions, meta.teams);
}

async function loadFilterMeta() {
  if (!dom.filterSport || !dom.filterLeague) {
    return;
  }
  const params = {
    sport: dom.filterSport.value.trim(),
    league: dom.filterLeague.value.trim(),
    start_after: getIsoFromLocalInput(dom.filterStartAfter),
    start_before: getIsoFromLocalInput(dom.filterStartBefore),
    market_key: dom.filterMarketKey ? dom.filterMarketKey.value.trim() : "",
    ...getHealthParams(),
    ...getBookmakerParams(),
  };
  try {
    const data = await fetchJson("/meta/filters", params);
    updateFilterMeta(data);
  } catch (err) {
    // Non-blocking: leave existing suggestions if the meta request fails.
  }
}

function getIsoFromLocalInput(input) {
  if (!input.value) {
    return undefined;
  }
  const date = new Date(input.value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return date.toISOString();
}

function renderWorkerStatus(status) {
  if (!dom.workerStatus || !dom.workerMeta) {
    return;
  }
  if (!status) {
    dom.workerStatus.textContent = "Unknown";
    dom.workerMeta.textContent = "";
    return;
  }
  const running = Boolean(status.running);
  dom.workerStatus.textContent = running ? "Running" : "Stopped";
  const lastRun = status.last_run_at ? `Last run ${formatDateTime(status.last_run_at)}` : "";
  const error = status.last_error ? `Error: ${status.last_error}` : "";
  dom.workerMeta.textContent = [lastRun, error].filter(Boolean).join(" • ");
  if (dom.workerStart) {
    dom.workerStart.disabled = running;
  }
  if (dom.workerStop) {
    dom.workerStop.disabled = !running;
  }
}

async function loadWorkerStatus() {
  if (!dom.workerStatus) {
    return;
  }
  try {
    const data = await fetchJson("/worker/status");
    state.workerStatus = data;
    renderWorkerStatus(data);
  } catch (err) {
    dom.workerStatus.textContent = "Unavailable";
    dom.workerMeta.textContent = "";
  }
}

async function startWorker() {
  if (!dom.workerStart) {
    return;
  }
  dom.workerStart.classList.add("loading");
  try {
    const data = await requestJson("/worker/start", "POST");
    state.workerStatus = data;
    renderWorkerStatus(data);
    showToast("Worker started");
  } catch (err) {
    showToast("Failed to start worker");
  } finally {
    dom.workerStart.classList.remove("loading");
  }
}

async function stopWorker() {
  if (!dom.workerStop) {
    return;
  }
  dom.workerStop.classList.add("loading");
  try {
    const data = await requestJson("/worker/stop", "POST");
    state.workerStatus = data;
    renderWorkerStatus(data);
    showToast("Worker stopped");
  } catch (err) {
    showToast("Failed to stop worker");
  } finally {
    dom.workerStop.classList.remove("loading");
  }
}

async function loadIngestHealth() {
  try {
    const data = await fetchJson("/health/ingest");
    if (!Array.isArray(data) || data.length === 0) {
      dom.ingestSummary.textContent = "No ingest data";
      dom.ingestDetails.textContent = "";
      await loadWorkerStatus();
      await loadApiStatus();
      return;
    }
    const healthy = data.filter((row) => row.is_healthy).length;
    const total = data.length;
    const ages = data.map((row) => row.age_seconds || 0);
    const maxAge = Math.max(...ages);
    dom.ingestSummary.textContent = `${healthy}/${total} healthy`;
    dom.ingestDetails.textContent = `Max age ${maxAge}s`;
  } catch (err) {
    dom.ingestSummary.textContent = "Health check failed";
    dom.ingestDetails.textContent = "";
  } finally {
    await loadWorkerStatus();
    await loadApiStatus();
  }
}

async function loadEvents(reset) {
  if (reset) {
    state.eventOffset = 0;
    state.events = [];
    state.selectedEvent = null;
    dom.oddsView.innerHTML = "<div class=\"data-card\">Loading odds screen...</div>";
    dom.arbView.innerHTML = "<div class=\"data-card\">Select an event to view arbitrage.</div>";
    dom.evView.innerHTML = "<div class=\"data-card\">Select an event to view EV picks.</div>";
    updateHeader();
  }
  dom.eventsList.innerHTML = "<div class=\"meta\">Loading...</div>";
  announceStatus("Loading events.");
  const params = {
    sport: dom.filterSport.value.trim(),
    league: dom.filterLeague.value.trim(),
    start_after: getIsoFromLocalInput(dom.filterStartAfter),
    start_before: getIsoFromLocalInput(dom.filterStartBefore),
    ...getHealthParams(),
    limit: state.eventLimit,
    offset: state.eventOffset,
  };
  try {
    const data = await fetchJson("/events", params);
    if (Array.isArray(data)) {
      state.events = reset ? data : state.events.concat(data);
      if (data.length > 0) {
        state.eventOffset += data.length;
      }
    }
    renderEvents();
    if (reset) {
      loadFilterMeta();
    }
    announceStatus(`Loaded ${state.events.length} events.`);
  } catch (err) {
    dom.eventsList.innerHTML = "<div class=\"meta\">Failed to load events</div>";
    showToast("Events request failed");
    announceStatus("Failed to load events.");
  }
}

function renderEvents() {
  const search = getSearchTerm();
  const filtered = state.events.filter((event) => eventMatchesSearch(event, search));

  dom.eventsMeta.textContent = `${filtered.length} events`;
  dom.eventsList.innerHTML = "";

  if (filtered.length === 0) {
    dom.eventsList.innerHTML = "<div class=\"meta\">No events in scope</div>";
    return;
  }

  filtered.forEach((event) => {
    const item = document.createElement("div");
    item.className = `event-item${state.selectedEvent && event.id === state.selectedEvent.id ? " active" : ""}`;
    item.innerHTML = `
      <div class="event-title">${escapeHtml(event.home_team)} vs ${escapeHtml(event.away_team)}</div>
      <div class="event-meta">${escapeHtml(event.league)} | ${formatDateTime(event.start_time)}</div>
    `;
    item.addEventListener("click", () => selectEvent(event.id));
    dom.eventsList.appendChild(item);
  });
}

function selectEvent(eventId) {
  const event = state.events.find((row) => row.id === eventId);
  if (!event) {
    return;
  }
  state.selectedEvent = event;
  updateHeader();
  renderEvents();
  if (state.activeTab === "arb" || state.activeTab === "ev") {
    loadEventData();
  } else if (state.activeTab === "odds") {
    renderOddsScreen();
  }
}

function renderLoading(view) {
  view.innerHTML = "<div class=\"data-card\">Loading...</div>";
}

async function loadEventData() {
  if (!state.selectedEvent) {
    return;
  }
  renderLoading(dom.arbView);
  renderLoading(dom.evView);
  await Promise.all([loadArbitrage(), loadPositiveEv()]);
}

function getMarketParams() {
  return {
    market_key: dom.filterMarketKey.value.trim(),
    period: dom.filterPeriod.value.trim(),
  };
}

function getHealthParams() {
  return {
    include_stale: dom.toggleIncludeStale ? dom.toggleIncludeStale.checked : false,
    include_unhealthy: dom.toggleIncludeUnhealthy ? dom.toggleIncludeUnhealthy.checked : false,
  };
}

function getBookmakerParams() {
  if (state.bookmakerFilterAll) {
    return {};
  }
  const ids = Array.from(state.selectedBookmakerIds).filter((id) => Number.isFinite(id));
  if (!ids.length) {
    return {};
  }
  return { bookmaker_ids: ids.join(",") };
}

function getArbSearchBookmakerParams() {
  if ((state.arbSearchBookmakerMode || "include_selected") !== "include_selected") {
    return {};
  }
  return getBookmakerParams();
}

async function loadOddsScreen(options = {}) {
  if (state.oddsScreenLoading) {
    return;
  }
  const {
    reset = true,
    limitOverride = null,
    offsetOverride = null,
    showLoader = reset,
    announce = true,
  } = options;
  state.oddsScreenLoading = true;
  if (reset) {
    if (showLoader) {
      renderLoading(dom.oddsView);
    }
    state.oddsScreenOffset = 0;
    state.oddsScreenHasMore = true;
    state.oddsScreen = { bookmakers: [], rows: [] };
    state.oddsScreenWarning = null;
  }
  state.oddsScreenTotalsLoading = true;
  updateOddsLoadMeta();
  if (!reset) {
    setOddsLoadMoreLoading(true);
  }
  if (announce) {
    if (reset) {
      announceStatus("Loading odds screen.");
    } else {
      const totalRows = Number.isFinite(state.oddsScreenTotalRows) ? state.oddsScreenTotalRows : null;
      const loadedRows = Array.isArray(state.oddsScreen.rows) ? state.oddsScreen.rows.length : 0;
      if (totalRows !== null) {
        announceStatus(`Loading more odds. Showing ${Math.min(loadedRows, totalRows)} of ${totalRows} rows.`);
      } else {
        announceStatus("Loading more odds.");
      }
    }
  }
  const params = {
    sport: dom.filterSport.value.trim(),
    league: dom.filterLeague.value.trim(),
    start_after: getIsoFromLocalInput(dom.filterStartAfter),
    start_before: getIsoFromLocalInput(dom.filterStartBefore),
    ...getMarketParams(),
    ...getBookmakerParams(),
    ...getHealthParams(),
    limit: limitOverride ?? state.oddsScreenLimit,
    offset: offsetOverride ?? state.oddsScreenOffset,
  };
  try {
    const data = await fetchJson("/odds/screen", params);
    mergeOddsScreenResponse(data || { bookmakers: [], rows: [] }, reset);
    renderOddsScreen();
    if (announce) {
      announceOddsScreenProgress();
    }
  } catch (err) {
    dom.oddsView.innerHTML = "<div class=\"data-card\">Failed to load odds screen</div>";
    showToast("Odds screen request failed");
    if (announce) {
      announceStatus("Failed to load odds screen.");
    }
    state.oddsScreenTotalsLoading = false;
    updateOddsLoadMeta();
  } finally {
    if (!reset) {
      setOddsLoadMoreLoading(false);
    }
    state.oddsScreenLoading = false;
  }
}

function mergeOddsScreenResponse(data, reset) {
  const responseBooks = Array.isArray(data.bookmakers) ? data.bookmakers : [];
  const hasWarning = Object.prototype.hasOwnProperty.call(data, "warning");
  if (reset) {
    state.oddsScreen.bookmakers = responseBooks.slice();
    state.oddsScreen.rows = [];
    state.oddsScreenTotalRows = Number.isFinite(data.total_rows) ? data.total_rows : null;
    state.oddsScreenMaxRows = Number.isFinite(data.max_rows) ? data.max_rows : null;
    state.oddsScreenIsCapped = Boolean(data.is_capped);
    state.oddsScreenWarning = typeof data.warning === "string" ? data.warning : null;
  } else {
    if (Number.isFinite(data.total_rows)) {
      state.oddsScreenTotalRows = data.total_rows;
    }
    if (Number.isFinite(data.max_rows)) {
      state.oddsScreenMaxRows = data.max_rows;
    }
    if (typeof data.is_capped === "boolean") {
      state.oddsScreenIsCapped = data.is_capped;
    }
    if (hasWarning) {
      state.oddsScreenWarning = typeof data.warning === "string" ? data.warning : null;
    } else {
      state.oddsScreenWarning = null;
    }
    const existingBooks = state.oddsScreen.bookmakers;
    const existingIds = new Set(existingBooks.map((book) => book.id));
    const newBooks = responseBooks.filter((book) => !existingIds.has(book.id));
    if (newBooks.length) {
      state.oddsScreen.bookmakers = existingBooks.concat(newBooks);
      state.oddsScreen.rows = state.oddsScreen.rows.map((row) => {
        row.outcomes = row.outcomes.map((outcome) => {
          const padded = outcome.prices.slice();
          for (let i = 0; i < newBooks.length; i += 1) {
            padded.push(null);
          }
          return { ...outcome, prices: padded };
        });
        return row;
      });
    }
  }

  const globalBooks = state.oddsScreen.bookmakers;
  const idToIndex = new Map(globalBooks.map((book, index) => [book.id, index]));
  const responseRows = Array.isArray(data.rows) ? data.rows : [];
  const normalizedRows = responseRows.map((row) => {
    const outcomes = Array.isArray(row.outcomes) ? row.outcomes : [];
    const normalizedOutcomes = outcomes.map((outcome) => {
      const prices = Array.isArray(outcome.prices) ? outcome.prices : [];
      const alignedPrices = Array(globalBooks.length).fill(null);
      responseBooks.forEach((book, idx) => {
        const globalIndex = idToIndex.get(book.id);
        if (globalIndex === undefined) {
          return;
        }
        alignedPrices[globalIndex] = prices[idx] ?? null;
      });
      let bestPrice = null;
      let bestIndex = null;
      alignedPrices.forEach((price, idx) => {
        if (price === null || price === undefined) {
          return;
        }
        if (bestPrice === null || price > bestPrice) {
          bestPrice = price;
          bestIndex = idx;
        }
      });
      return {
        ...outcome,
        prices: alignedPrices,
        best_price: bestPrice,
        best_bookmaker_index: bestIndex,
      };
    });
    return { ...row, outcomes: normalizedOutcomes };
  });

  state.oddsScreen.rows = state.oddsScreen.rows.concat(normalizedRows);
  if (Number.isFinite(data.limit)) {
    state.oddsScreenLimit = data.limit;
  }
  const responseOffset = Number.isFinite(data.offset) ? data.offset : state.oddsScreenOffset;
  state.oddsScreenOffset = responseOffset + responseRows.length;
  if (typeof data.has_more === "boolean") {
    state.oddsScreenHasMore = data.has_more;
  } else {
    state.oddsScreenHasMore = responseRows.length >= state.oddsScreenLimit;
  }
  state.oddsScreenTotalsLoading = false;
  dom.oddsLoadMore.style.display = state.activeTab === "odds" && state.oddsScreenHasMore ? "inline-flex" : "none";
  if (state.activeTab === "odds") {
    updateHeader();
  }
  updateOddsLoadMeta();
}

function renderOddsScreen() {
  const screen = state.oddsScreen || { bookmakers: [], rows: [] };
  const rows = getVisibleOddsRows();
  const allBooks = Array.isArray(screen.bookmakers) ? screen.bookmakers : [];
  const visibleBooks = getVisibleBookmakers();
  state.oddsOutcomeContext = new Map();
  state.oddsMarketContext = new Map();
  if (!visibleBooks.length && allBooks.length) {
    dom.oddsView.innerHTML = "<div class=\"data-card\">Select at least one bookmaker to view odds.</div>";
    dom.oddsLoadMore.style.display = state.oddsScreenHasMore ? "inline-flex" : "none";
    updateOddsLoadMeta();
    return;
  }
  if (dom.toggleOnlySelected && dom.toggleOnlySelected.checked && !state.selectedEvent) {
    dom.oddsView.innerHTML = "<div class=\"data-card\">Select an event to filter the odds screen.</div>";
    dom.oddsLoadMore.style.display = "none";
    updateOddsLoadMeta();
    return;
  }
  if (!rows.length) {
    if (dom.toggleOnlySelected && dom.toggleOnlySelected.checked && state.selectedEvent) {
      const hint = state.oddsScreenHasMore ? " Load more to continue." : "";
      dom.oddsView.innerHTML = `<div class="data-card">No rows for the selected event yet.${hint}</div>`;
      dom.oddsLoadMore.style.display = state.oddsScreenHasMore ? "inline-flex" : "none";
    } else {
      const includeStale = dom.toggleIncludeStale ? dom.toggleIncludeStale.checked : false;
      const message = includeStale
        ? "No odds in scope for this screen."
        : "No fresh odds for current filters. Try broadening filters or enable Include stale odds.";
      dom.oddsView.innerHTML = `<div class="data-card">${message}</div>`;
      dom.oddsLoadMore.style.display = "none";
    }
    updateOddsLoadMeta();
    return;
  }

  const books = visibleBooks.length ? visibleBooks : allBooks;
  const bookIndexMap = new Map();
  allBooks.forEach((book, index) => {
    bookIndexMap.set(book.id, index);
  });
  const header = `
    <div class="row header" style="grid-template-columns: 220px repeat(${books.length}, minmax(80px, 1fr));">
      <div class="cell outcome">Outcome</div>
      ${books.map((book) => `<div class="cell book">${escapeHtml(book.name)}</div>`).join("")}
    </div>
  `;

  const cards = rows
    .map((row) => {
      const market = row.market;
      const event = row.event;
      const outcomes = Array.isArray(row.outcomes) ? row.outcomes : [];
      const updatedAt = row.updated_at ? formatDateTime(row.updated_at) : "";
      const impliedTotal = Number.isFinite(row.implied_total) ? Number(row.implied_total) : null;
      const arbValue = Number.isFinite(row.arb_percentage) ? Number(row.arb_percentage) : null;
      const overround = Number.isFinite(row.overround) ? Number(row.overround) : null;
      const outcomeRows = outcomes.map((outcome) => {
        const outcomeId = outcome.outcome_id ?? outcome.id;
        const prices = Array.isArray(outcome.prices) ? outcome.prices : [];
        const priceList = books.map((book) => {
          const fullIndex = bookIndexMap.get(book.id);
          return fullIndex === undefined ? null : prices[fullIndex];
        });
        let bestPrice = null;
        let bestIndex = null;
        priceList.forEach((price, index) => {
          if (price === null || price === undefined) {
            return;
          }
          if (bestPrice === null || price > bestPrice) {
            bestPrice = price;
            bestIndex = index;
          }
        });
        const cells = priceList.map((price, index) => {
          const isBest = bestIndex === index;
          return `<div class="cell price${isBest ? " best" : ""}">${formatPrice(price)}</div>`;
        });
        if (Number.isFinite(outcomeId)) {
          state.oddsOutcomeContext.set(outcomeId, { event, market, outcome });
        }
        const outcomeLabel = `
          <button class="link-button odds-history-trigger" data-outcome-id="${outcomeId}">
            ${escapeHtml(outcome.label)}
          </button>
        `;
        return `
          <div class="row" style="grid-template-columns: 220px repeat(${books.length}, minmax(80px, 1fr));">
            <div class="cell outcome">${outcomeLabel}</div>
            ${cells.join("")}
          </div>
        `;
      });

      const impliedText = impliedTotal !== null ? impliedTotal.toFixed(3) : "n/a";
      const metrics = [
        `<span class="metric">Implied ${impliedText}</span>`,
        overround !== null ? `<span class="metric warn">Overround ${overround.toFixed(3)}</span>` : "",
        arbValue !== null ? `<span class="metric arb">ARB +${formatPercent(arbValue)}</span>` : "",
        updatedAt ? `<span class="metric">Updated ${escapeHtml(updatedAt)}</span>` : "",
      ]
        .filter(Boolean)
        .join("");

      const lineText = market.line !== null && market.line !== undefined ? `Line ${market.line}` : "";
      const roundText =
        market.round_number !== null && market.round_number !== undefined ? `Round ${market.round_number}` : "";
      const teamSide = market.team_side ? `Side ${market.team_side}` : "";
      const metaBits = [lineText, roundText, teamSide].filter(Boolean).join(" | ");

      const rowLines = outcomeRows.join("");
      const outcomeContextList = outcomes
        .map((outcome) => {
          const outcomeId = outcome.outcome_id ?? outcome.id;
          return Number.isFinite(outcomeId) ? { id: outcomeId, label: outcome.label } : null;
        })
        .filter(Boolean);
      state.oddsMarketContext.set(market.id, { event, market, outcomes: outcomeContextList });

      return `
        <div class="market-card">
          <div class="market-head">
            <div>
              <div class="market-title">${escapeHtml(event.home_team)} vs ${escapeHtml(event.away_team)}</div>
              <div class="market-sub">${escapeHtml(event.league)} | ${formatDateTime(event.start_time)} | ${escapeHtml(
                market.market_key
              )} | ${escapeHtml(market.period)}${metaBits ? ` | ${escapeHtml(metaBits)}` : ""}</div>
            </div>
            <div class="market-actions">
              <div class="market-metrics">${metrics}</div>
              <button class="ghost history-button market-history-trigger" data-market-id="${market.id}">
                Line movement
              </button>
            </div>
          </div>
          <div class="market-table">
            ${header}
            ${rowLines}
          </div>
        </div>
      `;
    })
    .join("");

  dom.oddsView.innerHTML = cards;
  dom.oddsLoadMore.style.display = state.activeTab === "odds" && state.oddsScreenHasMore ? "inline-flex" : "none";
  updateOddsLoadMeta();
}

async function loadArbitrage() {
  if (!state.selectedEvent) {
    return;
  }
  announceStatus("Loading arbitrage.");
  const params = {
    event_id: state.selectedEvent.id,
    ...getMarketParams(),
    ...getBookmakerParams(),
    ...getHealthParams(),
  };
  try {
    const data = await fetchJson("/arbitrage", params);
    state.arbitrage = Array.isArray(data) ? data : [];
    renderArbitrage();
    announceStatus("Arbitrage updated.");
  } catch (err) {
    dom.arbView.innerHTML = "<div class=\"data-card\">Failed to load arbitrage</div>";
    announceStatus("Failed to load arbitrage.");
  }
}

function renderArbitrage() {
  if (!state.selectedEvent) {
    dom.arbView.innerHTML = "<div class=\"data-card\">Select an event to view arbitrage.</div>";
    return;
  }
  if (!state.arbitrage.length) {
    dom.arbView.innerHTML = "<div class=\"data-card\">No arbitrage found for this event.</div>";
    return;
  }

  const cards = state.arbitrage
    .sort((a, b) => b.arb_percentage - a.arb_percentage)
    .map((arb) => {
      const outcomes = arb.outcomes
        .map((outcome) => {
          return `
            <div class="data-row">
              <div class="data-main">
                <div class="event-title">${escapeHtml(outcome.label)}</div>
                <div class="meta">${escapeHtml(outcome.bookmaker.name)}</div>
              </div>
              <div class="badge good">${formatPrice(outcome.best_price)}</div>
            </div>
          `;
        })
        .join("");

      return `
        <div class="data-card">
          <div class="data-row">
            <div class="data-main">
              <div class="market-title">${escapeHtml(arb.market.market_key)} | ${escapeHtml(arb.market.period)}</div>
              <div class="meta">Implied ${arb.total_implied_probability.toFixed(3)}</div>
            </div>
            <div class="badge good">ARB +${formatPercent(arb.arb_percentage)}</div>
          </div>
          ${outcomes}
        </div>
      `;
    })
    .join("");

  dom.arbView.innerHTML = cards;
}

async function loadPositiveEv() {
  if (!state.selectedEvent) {
    return;
  }
  announceStatus("Loading positive EV.");
  const minEvRaw = dom.filterMinEv.value;
  const minEv = minEvRaw !== "" ? Number(minEvRaw) : undefined;
  const params = {
    event_id: state.selectedEvent.id,
    ...getMarketParams(),
    ...getBookmakerParams(),
    ...getHealthParams(),
    min_ev: Number.isFinite(minEv) ? minEv : undefined,
    include_negative: dom.toggleIncludeNegative.checked,
    allow_single_book: dom.toggleAllowSingleBook ? dom.toggleAllowSingleBook.checked : false,
  };
  try {
    const data = await fetchJson("/positive-ev", params);
    state.ev = Array.isArray(data) ? data : [];
    renderPositiveEv();
    announceStatus("Positive EV updated.");
  } catch (err) {
    dom.evView.innerHTML = "<div class=\"data-card\">Failed to load EV picks</div>";
    announceStatus("Failed to load positive EV.");
  }
}

function renderPositiveEv() {
  if (!state.selectedEvent) {
    dom.evView.innerHTML = "<div class=\"data-card\">Select an event to view EV picks.</div>";
    return;
  }
  if (!state.ev.length) {
    dom.evView.innerHTML = "<div class=\"data-card\">No EV picks found for this event.</div>";
    return;
  }

  const cards = state.ev
    .sort((a, b) => b.expected_value - a.expected_value)
    .map((pick) => {
      const evPct = pick.expected_value * 100;
      return `
        <div class="data-card">
          <div class="data-row">
            <div class="data-main">
              <div class="market-title">${escapeHtml(pick.market.market_key)} | ${escapeHtml(pick.market.period)}</div>
              <div class="meta">${escapeHtml(pick.outcome.label)} | ${escapeHtml(pick.bookmaker.name)}</div>
            </div>
            <div class="badge ${pick.is_positive ? "good" : "warn"}">${formatPercent(evPct)}</div>
          </div>
          <div class="data-row">
            <div class="data-main">
              <div class="meta">Price ${formatPrice(pick.price)}</div>
              <div class="meta">Fair prob ${(pick.fair_probability * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  dom.evView.innerHTML = cards;
}

async function loadArbSearch(options = {}) {
  const { reset = false } = options;
  if (state.arbSearchLoading) {
    return;
  }
  if (!reset && !state.arbSearchHasMore) {
    return;
  }
  state.arbSearchLoading = true;
  if (reset) {
    state.arbSearch = [];
    state.arbSearchOffset = 0;
    state.arbSearchHasMore = true;
    renderLoading(dom.arbSearchView);
  } else {
    setArbSearchLoadMoreLoading(true);
  }
  updateArbSearchMeta();
  announceStatus("Loading arbitrage scanner.");
  const minArbRaw = dom.filterMinArb ? dom.filterMinArb.value : "";
  const minArb = minArbRaw !== "" ? Number(minArbRaw) : undefined;
  const params = {
    sport: dom.filterSport.value.trim(),
    league: dom.filterLeague.value.trim(),
    start_after: getIsoFromLocalInput(dom.filterStartAfter),
    start_before: getIsoFromLocalInput(dom.filterStartBefore),
    ...getMarketParams(),
    ...getArbSearchBookmakerParams(),
    ...getHealthParams(),
    min_arb: Number.isFinite(minArb) ? minArb : undefined,
    limit: state.arbSearchLimit,
    offset: state.arbSearchOffset,
  };
  try {
    const data = await fetchJson("/arbitrage/search", params);
    const rows = Array.isArray(data) ? data : [];
    state.arbSearch = reset ? rows : state.arbSearch.concat(rows);
    if (rows.length > 0) {
      state.arbSearchOffset += rows.length;
    }
    state.arbSearchHasMore = rows.length >= state.arbSearchLimit;
    renderArbSearch();
    announceStatus("Arbitrage scanner updated.");
  } catch (err) {
    dom.arbSearchView.innerHTML = "<div class=\"data-card\">Failed to load arbitrage scanner</div>";
    announceStatus("Failed to load arbitrage scanner.");
  } finally {
    state.arbSearchLoading = false;
    setArbSearchLoadMoreLoading(false);
    updateArbSearchMeta();
  }
}

function sortArbSearchRows(rows) {
  const list = Array.isArray(rows) ? rows.slice() : [];
  const sortMode = state.arbSearchSort || "arb_desc";
  const fallbackCompare = (a, b) => {
    const aStart = parseDateMs(a?.event?.start_time) ?? 0;
    const bStart = parseDateMs(b?.event?.start_time) ?? 0;
    if (aStart !== bStart) {
      return aStart - bStart;
    }
    return (b?.arb_percentage ?? 0) - (a?.arb_percentage ?? 0);
  };
  const staleValue = (arb) => {
    const summary = getArbStalenessSummary(arb);
    return Number.isFinite(summary.oldestAgeSeconds) ? summary.oldestAgeSeconds : Number.POSITIVE_INFINITY;
  };
  list.sort((a, b) => {
    if (sortMode === "arb_asc") {
      const diff = (a?.arb_percentage ?? 0) - (b?.arb_percentage ?? 0);
      return diff || fallbackCompare(a, b);
    }
    if (sortMode === "start_asc") {
      return fallbackCompare(a, b);
    }
    if (sortMode === "start_desc") {
      return -fallbackCompare(a, b);
    }
    if (sortMode === "staleness_asc") {
      const diff = staleValue(a) - staleValue(b);
      return diff || fallbackCompare(a, b);
    }
    if (sortMode === "staleness_desc") {
      const diff = staleValue(b) - staleValue(a);
      return diff || fallbackCompare(a, b);
    }
    const diff = (b?.arb_percentage ?? 0) - (a?.arb_percentage ?? 0);
    return diff || fallbackCompare(a, b);
  });
  return list;
}

function renderArbSearch() {
  const data = Array.isArray(state.arbSearch) ? state.arbSearch : [];
  if (!data.length) {
    dom.arbSearchView.innerHTML = "<div class=\"data-card\">No arbitrage opportunities found.</div>";
    updateArbSearchMeta();
    return;
  }
  const visible = getVisibleArbSearch();
  if (!visible.length) {
    dom.arbSearchView.innerHTML = "<div class=\"data-card\">No arbitrage matches current filters.</div>";
    updateArbSearchMeta();
    return;
  }

  const nowMs = Date.now();
  const maxAgeClamp = getArbSearchMaxAgeClamp();
  const cards = sortArbSearchRows(visible)
    .map((arb) => {
      const market = arb.market || {};
      const event = arb.event || {};
      const key = getArbUiKey(arb);
      const isOpen = state.arbSearchExpandedKeys.has(key);
      const staleness = getArbStalenessSummary(arb, nowMs);
      const staleClass = getArbStalenessBadgeClass(staleness, maxAgeClamp);
      const stalenessText =
        Number.isFinite(staleness.oldestAgeSeconds) && Number.isFinite(staleness.newestAgeSeconds)
          ? `${formatAgeSeconds(staleness.oldestAgeSeconds)} / ${formatAgeSeconds(staleness.newestAgeSeconds)}`
          : "n/a";
      const latestUpdateText = staleness.newestUpdateIso ? formatDateTime(staleness.newestUpdateIso) : "n/a";
      const marketHint = formatArbMarketHint(market);
      const marketIdentity = formatArbMarketIdentity(market);
      const outcomes = Array.isArray(arb.outcomes) ? arb.outcomes : [];
      const outcomeSummaryRows = outcomes
        .map((outcome) => {
          const age = getArbOutcomeAgeSeconds(outcome, nowMs);
          const book = outcome?.bookmaker || {};
          return `
            <div class="data-row arb-leg-summary-row">
              <div class="data-main">
                <div class="event-title">${escapeHtml(outcome?.label || outcome?.outcome_key || "Outcome")}</div>
                <div class="meta">${escapeHtml(book.name || book.key || "Unknown book")} (${escapeHtml(
                  book.key || "n/a"
                )})${Number.isFinite(age) ? ` | ${escapeHtml(formatAgeSeconds(age))} old` : ""}</div>
              </div>
              <div class="badge good">${escapeHtml(formatDecimalCompact(outcome?.best_price))}</div>
            </div>
          `;
        })
        .join("");

      const detailLegRows = outcomes
        .map((outcome) => {
          const book = outcome?.bookmaker || {};
          const hint = outcome?.source_hint || {};
          const age = getArbOutcomeAgeSeconds(outcome, nowMs);
          const sourceMatchup = getArbSourceMatchup(outcome, event);
          const sourceLeague = hint?.source_league || event.league || "";
          const sourceStart = hint?.source_start_time || event.start_time || "";
          return `
            <tr>
              <td>${escapeHtml(outcome?.label || "")} (${escapeHtml(outcome?.outcome_key || "")})</td>
              <td>${escapeHtml(book.name || "Unknown")} (${escapeHtml(book.key || "n/a")})</td>
              <td>${escapeHtml(formatDecimalCompact(outcome?.best_price))}</td>
              <td>${escapeHtml(formatDateTimeDetailed(outcome?.best_price_last_update))}</td>
              <td>${escapeHtml(Number.isFinite(age) ? formatAgeSeconds(age) : "n/a")}</td>
              <td>${escapeHtml(hint?.external_event_id || "n/a")}</td>
              <td>${escapeHtml(sourceLeague || "n/a")}</td>
              <td>${escapeHtml(sourceMatchup || "n/a")}</td>
              <td>${escapeHtml(formatDateTimeDetailed(sourceStart) || "n/a")}</td>
            </tr>
          `;
        })
        .join("");

      return `
        <details class="data-card arb-search-card" data-arb-key="${escapeHtml(key)}"${isOpen ? " open" : ""}>
          <summary class="arb-search-summary" data-arb-key="${escapeHtml(key)}">
            <div class="data-row arb-summary-top">
              <div class="data-main">
                <div class="market-title">${escapeHtml(event.league || "")}</div>
                <div class="meta">${escapeHtml(event.home_team || "")} vs ${escapeHtml(event.away_team || "")} | ${escapeHtml(
                  formatDateTime(event.start_time)
                )}</div>
                <div class="meta arb-market-identity">${escapeHtml(marketIdentity)}</div>
                <div class="meta arb-market-hint">${escapeHtml(marketHint)}</div>
              </div>
              <div class="arb-summary-badges">
                <span class="badge">Implied ${Number.isFinite(arb.total_implied_probability) ? arb.total_implied_probability.toFixed(3) : "-"}</span>
                <span class="badge ${staleClass}">Staleness ${escapeHtml(stalenessText)}</span>
                <span class="badge good">ARB ${escapeHtml(formatPercent(arb.arb_percentage))}</span>
              </div>
            </div>
            <div class="arb-summary-meta">
              <span>Newest update: ${escapeHtml(latestUpdateText)}</span>
              <span>Click to ${isOpen ? "collapse" : "expand"} details</span>
            </div>
            <div class="arb-leg-summary-list">
              ${outcomeSummaryRows}
            </div>
          </summary>
          <div class="arb-search-details">
            <div class="meta">Canonical event id: ${escapeHtml(String(event.id ?? "n/a"))}</div>
            <div class="meta">Canonical event key: ${escapeHtml(event.event_key || "n/a")}</div>
            <div class="meta">Market: ${escapeHtml(marketIdentity)}</div>
            <div class="arb-leg-table-wrap">
              <table class="arb-leg-table">
                <thead>
                  <tr>
                    <th>Outcome</th>
                    <th>Book</th>
                    <th>Price</th>
                    <th>Best Price Last Update</th>
                    <th>Age</th>
                    <th>External Event ID</th>
                    <th>Source League</th>
                    <th>Source Matchup</th>
                    <th>Source Start</th>
                  </tr>
                </thead>
                <tbody>
                  ${detailLegRows}
                </tbody>
              </table>
            </div>
          </div>
        </details>
      `;
    })
    .join("");

  dom.arbSearchView.innerHTML = cards;
  updateArbSearchMeta();
}

async function loadLowHoldSearch(options = {}) {
  const { reset = false } = options;
  if (state.lowHoldSearchLoading) {
    return;
  }
  if (!reset && !state.lowHoldSearchHasMore) {
    return;
  }
  state.lowHoldSearchLoading = true;
  if (reset) {
    state.lowHoldSearch = [];
    state.lowHoldSearchOffset = 0;
    state.lowHoldSearchHasMore = true;
    renderLoading(dom.lowHoldView);
  } else {
    setLowHoldLoadMoreLoading(true);
  }
  updateLowHoldMeta();
  announceStatus("Loading low hold scanner.");
  const maxOverroundRaw = dom.filterMaxOverround ? dom.filterMaxOverround.value : "";
  const maxOverround = maxOverroundRaw !== "" ? Number(maxOverroundRaw) : undefined;
  const params = {
    sport: dom.filterSport.value.trim(),
    league: dom.filterLeague.value.trim(),
    start_after: getIsoFromLocalInput(dom.filterStartAfter),
    start_before: getIsoFromLocalInput(dom.filterStartBefore),
    ...getMarketParams(),
    ...getBookmakerParams(),
    ...getHealthParams(),
    max_overround: Number.isFinite(maxOverround) ? maxOverround : undefined,
    limit: state.lowHoldSearchLimit,
    offset: state.lowHoldSearchOffset,
  };
  try {
    const data = await fetchJson("/arbitrage/near/search", params);
    const rows = Array.isArray(data) ? data : [];
    state.lowHoldSearch = reset ? rows : state.lowHoldSearch.concat(rows);
    if (rows.length > 0) {
      state.lowHoldSearchOffset += rows.length;
    }
    state.lowHoldSearchHasMore = rows.length >= state.lowHoldSearchLimit;
    renderLowHoldSearch();
    announceStatus("Low hold scanner updated.");
  } catch (err) {
    dom.lowHoldView.innerHTML = "<div class=\"data-card\">Failed to load low hold scanner</div>";
    announceStatus("Failed to load low hold scanner.");
  } finally {
    state.lowHoldSearchLoading = false;
    setLowHoldLoadMoreLoading(false);
    updateLowHoldMeta();
  }
}

function renderLowHoldSearch() {
  const data = Array.isArray(state.lowHoldSearch) ? state.lowHoldSearch : [];
  if (!data.length) {
    dom.lowHoldView.innerHTML = "<div class=\"data-card\">No low hold markets found.</div>";
    updateLowHoldMeta();
    return;
  }
  const visible = getVisibleLowHoldSearch();
  if (!visible.length) {
    dom.lowHoldView.innerHTML = "<div class=\"data-card\">No low hold markets match current filters.</div>";
    updateLowHoldMeta();
    return;
  }

  const cards = visible
    .sort((a, b) => a.total_implied_probability - b.total_implied_probability)
    .map((arb) => {
      const market = arb.market;
      const event = arb.event;
      const lineText = market.line !== null && market.line !== undefined ? `Line ${market.line}` : "";
      const roundText =
        market.round_number !== null && market.round_number !== undefined ? `Round ${market.round_number}` : "";
      const teamSide = market.team_side ? `Side ${market.team_side}` : "";
      const metaBits = [lineText, roundText, teamSide].filter(Boolean).join(" | ");
      const holdPct = (arb.total_implied_probability - 1) * 100;
      const holdLabel = Number.isFinite(holdPct) ? `Hold +${formatPercent(holdPct)}` : "Hold";
      const outcomes = arb.outcomes
        .map((outcome) => {
          return `
            <div class="data-row">
              <div class="data-main">
                <div class="event-title">${escapeHtml(outcome.label)}</div>
                <div class="meta">${escapeHtml(outcome.bookmaker.name)}</div>
              </div>
              <div class="badge">${formatPrice(outcome.best_price)}</div>
            </div>
          `;
        })
        .join("");
      return `
        <div class="data-card">
          <div class="data-row">
            <div class="data-main">
              <div class="market-title">${escapeHtml(market.market_key)} | ${escapeHtml(market.period)}${
                metaBits ? ` | ${escapeHtml(metaBits)}` : ""
              }</div>
              <div class="meta">${escapeHtml(event.home_team)} vs ${escapeHtml(event.away_team)} | ${escapeHtml(
                event.league
              )} | ${formatDateTime(event.start_time)}</div>
              <div class="meta">Implied ${arb.total_implied_probability.toFixed(3)}</div>
            </div>
            <div class="badge warn">${holdLabel}</div>
          </div>
          ${outcomes}
        </div>
      `;
    })
    .join("");

  dom.lowHoldView.innerHTML = cards;
  updateLowHoldMeta();
}

async function loadEvSearch(options = {}) {
  const { reset = false } = options;
  if (state.evSearchLoading) {
    return;
  }
  if (!reset && !state.evSearchHasMore) {
    return;
  }
  state.evSearchLoading = true;
  if (reset) {
    state.evSearch = [];
    state.evSearchOffset = 0;
    state.evSearchHasMore = true;
    renderLoading(dom.evSearchView);
  } else {
    setEvSearchLoadMoreLoading(true);
  }
  updateEvSearchMeta();
  announceStatus("Loading EV scanner.");
  const minEvRaw = dom.filterMinEv.value;
  const minEv = minEvRaw !== "" ? Number(minEvRaw) : undefined;
  const params = {
    sport: dom.filterSport.value.trim(),
    league: dom.filterLeague.value.trim(),
    start_after: getIsoFromLocalInput(dom.filterStartAfter),
    start_before: getIsoFromLocalInput(dom.filterStartBefore),
    ...getMarketParams(),
    ...getBookmakerParams(),
    ...getHealthParams(),
    min_ev: Number.isFinite(minEv) ? minEv : undefined,
    include_negative: dom.toggleIncludeNegative.checked,
    allow_single_book: dom.toggleAllowSingleBook ? dom.toggleAllowSingleBook.checked : false,
    limit: state.evSearchLimit,
    offset: state.evSearchOffset,
  };
  try {
    const data = await fetchJson("/positive-ev/search", params);
    const rows = Array.isArray(data) ? data : [];
    state.evSearch = reset ? rows : state.evSearch.concat(rows);
    if (rows.length > 0) {
      state.evSearchOffset += rows.length;
    }
    state.evSearchHasMore = rows.length >= state.evSearchLimit;
    renderEvSearch();
    announceStatus("EV scanner updated.");
  } catch (err) {
    dom.evSearchView.innerHTML = "<div class=\"data-card\">Failed to load EV scanner</div>";
    announceStatus("Failed to load EV scanner.");
  } finally {
    state.evSearchLoading = false;
    setEvSearchLoadMoreLoading(false);
    updateEvSearchMeta();
  }
}

function renderEvSearch() {
  const data = Array.isArray(state.evSearch) ? state.evSearch : [];
  if (!data.length) {
    dom.evSearchView.innerHTML = "<div class=\"data-card\">No EV picks found.</div>";
    updateEvSearchMeta();
    return;
  }
  const visible = getVisibleEvSearch();
  if (!visible.length) {
    dom.evSearchView.innerHTML = "<div class=\"data-card\">No EV picks match current filters.</div>";
    updateEvSearchMeta();
    return;
  }

  const cards = visible
    .sort((a, b) => b.expected_value - a.expected_value)
    .map((pick) => {
      const market = pick.market;
      const event = pick.event;
      const evPct = pick.expected_value * 100;
      const lineText = market.line !== null && market.line !== undefined ? `Line ${market.line}` : "";
      const roundText =
        market.round_number !== null && market.round_number !== undefined ? `Round ${market.round_number}` : "";
      const teamSide = market.team_side ? `Side ${market.team_side}` : "";
      const metaBits = [lineText, roundText, teamSide].filter(Boolean).join(" | ");
      return `
        <div class="data-card">
          <div class="data-row">
            <div class="data-main">
              <div class="market-title">${escapeHtml(market.market_key)} | ${escapeHtml(market.period)}${
                metaBits ? ` | ${escapeHtml(metaBits)}` : ""
              }</div>
              <div class="meta">${escapeHtml(event.home_team)} vs ${escapeHtml(event.away_team)} | ${escapeHtml(
                event.league
              )} | ${formatDateTime(event.start_time)}</div>
              <div class="meta">${escapeHtml(pick.outcome.label)} | ${escapeHtml(pick.bookmaker.name)}</div>
            </div>
            <div class="badge ${pick.is_positive ? "good" : "warn"}">${formatPercent(evPct)}</div>
          </div>
          <div class="data-row">
            <div class="data-main">
              <div class="meta">Price ${formatPrice(pick.price)}</div>
              <div class="meta">Fair prob ${(pick.fair_probability * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  dom.evSearchView.innerHTML = cards;
  updateEvSearchMeta();
}

function setActiveTab(tab) {
  state.activeTab = tab;
  dom.pills.forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.tab === tab);
  });
  dom.oddsView.classList.toggle("active", tab === "odds");
  dom.arbView.classList.toggle("active", tab === "arb");
  dom.evView.classList.toggle("active", tab === "ev");
  dom.arbSearchView.classList.toggle("active", tab === "arb-search");
  dom.lowHoldView.classList.toggle("active", tab === "low-hold");
  dom.evSearchView.classList.toggle("active", tab === "ev-search");
  dom.alertsView.classList.toggle("active", tab === "alerts");

  const showAlertFilters = tab === "alerts";
  const showEv = tab === "ev" || tab === "ev-search" || showAlertFilters;
  const showArb = tab === "arb-search" || showAlertFilters;
  const showArbSearchControls = tab === "arb-search";
  const showLowHold = tab === "low-hold" || showAlertFilters;
  const showOddsOnly = tab === "odds";
  const showAutoRefresh = tab === "odds";
  if (dom.arbFilterWrap) {
    dom.arbFilterWrap.style.display = showArb ? "flex" : "none";
  }
  if (dom.arbSearchAutoRefreshWrap) {
    dom.arbSearchAutoRefreshWrap.style.display = showArbSearchControls ? "flex" : "none";
  }
  if (dom.arbSearchIntervalWrap) {
    dom.arbSearchIntervalWrap.style.display = showArbSearchControls ? "flex" : "none";
  }
  if (dom.arbBookmakerModeWrap) {
    dom.arbBookmakerModeWrap.style.display = showArbSearchControls ? "flex" : "none";
  }
  if (dom.arbSearchMaxAgeWrap) {
    dom.arbSearchMaxAgeWrap.style.display = showArbSearchControls ? "flex" : "none";
  }
  if (dom.arbSearchSortWrap) {
    dom.arbSearchSortWrap.style.display = showArbSearchControls ? "flex" : "none";
  }
  if (dom.lowHoldFilterWrap) {
    dom.lowHoldFilterWrap.style.display = showLowHold ? "flex" : "none";
  }
  dom.evFilterWrap.style.display = showEv ? "flex" : "none";
  dom.evIncludeWrap.style.display = showEv ? "flex" : "none";
  if (dom.evSingleBookWrap) {
    dom.evSingleBookWrap.style.display = showEv ? "flex" : "none";
  }
  if (dom.toggleOnlySelected) {
    const toggleWrap = dom.toggleOnlySelected.closest(".toggle");
    if (toggleWrap) {
      toggleWrap.style.display = showOddsOnly ? "flex" : "none";
    }
  }
  if (dom.toggleAutoRefresh) {
    const toggleWrap = dom.toggleAutoRefresh.closest(".toggle");
    if (toggleWrap) {
      toggleWrap.style.display = showAutoRefresh ? "flex" : "none";
    }
  }
  updateHeader();
  syncRunIngestControls();

  if (dom.oddsActions) {
    dom.oddsActions.style.display = tab === "odds" ? "flex" : "none";
  }
  if (dom.arbSearchActions) {
    dom.arbSearchActions.style.display = tab === "arb-search" ? "flex" : "none";
  }
  if (dom.lowHoldActions) {
    dom.lowHoldActions.style.display = tab === "low-hold" ? "flex" : "none";
  }
  if (dom.evSearchActions) {
    dom.evSearchActions.style.display = tab === "ev-search" ? "flex" : "none";
  }
  if (dom.arbSearchHelpNote) {
    dom.arbSearchHelpNote.style.display = tab === "arb-search" ? "block" : "none";
  }

  if (tab === "odds") {
    stopArbSearchAutoRefresh();
    startOddsScreenStream();
    loadOddsScreen({ reset: true });
  } else {
    stopOddsScreenStream();
    if (tab !== "arb-search") {
      stopArbSearchAutoRefresh();
    }
    if (tab === "arb") {
      if (state.selectedEvent) {
        renderLoading(dom.arbView);
        loadArbitrage();
      }
    } else if (tab === "ev") {
      if (state.selectedEvent) {
        renderLoading(dom.evView);
        loadPositiveEv();
      }
    } else if (tab === "arb-search") {
      startArbSearchAutoRefresh();
      loadArbSearch({ reset: true });
    } else if (tab === "low-hold") {
      loadLowHoldSearch({ reset: true });
    } else if (tab === "ev-search") {
      loadEvSearch({ reset: true });
    } else if (tab === "alerts") {
      loadAlertHits();
    }
  }
}

function attachEvents() {
  const scheduleMetaRefresh = debounce(loadFilterMeta, 300);
  dom.applyFilters.addEventListener("click", async () => {
    await loadEvents(true);
    loadOddsScreen({ reset: true });
    if (state.activeTab === "arb-search") {
      loadArbSearch({ reset: true });
    }
    if (state.activeTab === "low-hold") {
      loadLowHoldSearch({ reset: true });
    }
    if (state.activeTab === "ev-search") {
      loadEvSearch({ reset: true });
    }
  });
  dom.resetFilters.addEventListener("click", () => {
    dom.filterSport.value = "";
    dom.filterLeague.value = "";
    dom.filterStartAfter.value = "";
    dom.filterStartBefore.value = "";
    dom.filterSearch.value = "";
    if (dom.filterMaxOverround) {
      dom.filterMaxOverround.value = "";
    }
    if (dom.arbSearchMaxAgeSeconds) {
      dom.arbSearchMaxAgeSeconds.value = "";
      state.arbSearchMaxAgeSeconds = null;
    }
    if (dom.arbBookmakerMode) {
      dom.arbBookmakerMode.value = "include_selected";
      state.arbSearchBookmakerMode = "include_selected";
    }
    if (dom.arbSearchSort) {
      dom.arbSearchSort.value = "arb_desc";
      state.arbSearchSort = "arb_desc";
    }
    if (dom.toggleIncludeStale) {
      dom.toggleIncludeStale.checked = false;
    }
    if (dom.toggleIncludeUnhealthy) {
      dom.toggleIncludeUnhealthy.checked = false;
    }
    loadEvents(true).then(() => {
      loadOddsScreen({ reset: true });
      if (state.activeTab === "arb-search") {
        loadArbSearch({ reset: true });
      }
      if (state.activeTab === "low-hold") {
        loadLowHoldSearch({ reset: true });
      }
      if (state.activeTab === "ev-search") {
        loadEvSearch({ reset: true });
      }
    });
  });
  dom.filterSearch.addEventListener("input", () => {
    renderEvents();
    renderArbSearch();
    renderLowHoldSearch();
    renderEvSearch();
    renderAlertsView();
  });
  if (dom.filterSport) {
    dom.filterSport.addEventListener("input", scheduleMetaRefresh);
  }
  if (dom.filterLeague) {
    dom.filterLeague.addEventListener("input", scheduleMetaRefresh);
  }
  if (dom.filterStartAfter) {
    dom.filterStartAfter.addEventListener("input", scheduleMetaRefresh);
  }
  if (dom.filterStartBefore) {
    dom.filterStartBefore.addEventListener("input", scheduleMetaRefresh);
  }
  if (dom.filterMarketKey) {
    dom.filterMarketKey.addEventListener("input", scheduleMetaRefresh);
  }
  dom.loadMore.addEventListener("click", () => loadEvents(false));
  dom.oddsLoadMore.addEventListener("click", () => loadOddsScreen({ reset: false }));
  dom.arbSearchLoadMore.addEventListener("click", () => loadArbSearch({ reset: false }));
  dom.lowHoldLoadMore.addEventListener("click", () => loadLowHoldSearch({ reset: false }));
  dom.evSearchLoadMore.addEventListener("click", () => loadEvSearch({ reset: false }));
  dom.oddsView.addEventListener("click", (event) => {
    const marketTrigger = event.target.closest(".market-history-trigger");
    if (marketTrigger) {
      const marketId = Number(marketTrigger.dataset.marketId);
      if (Number.isFinite(marketId)) {
        openMarketHistory(marketId);
      }
      return;
    }
    const trigger = event.target.closest(".odds-history-trigger");
    if (!trigger) {
      return;
    }
    const outcomeId = Number(trigger.dataset.outcomeId);
    if (!Number.isFinite(outcomeId)) {
      return;
    }
    openOddsHistory(outcomeId);
  });
  if (dom.arbSearchView) {
    dom.arbSearchView.addEventListener(
      "toggle",
      (event) => {
        const details = event.target;
        if (!details || details.tagName !== "DETAILS") {
          return;
        }
        const key = details.dataset.arbKey || "";
        if (!key) {
          return;
        }
        if (details.open) {
          state.arbSearchExpandedKeys.add(key);
        } else {
          state.arbSearchExpandedKeys.delete(key);
        }
      },
      true
    );
  }
  dom.refreshEvent.addEventListener("click", () => {
    if (state.activeTab === "odds") {
      loadOddsScreen({ reset: true });
    } else if (state.activeTab === "arb") {
      loadArbitrage();
    } else if (state.activeTab === "ev") {
      loadPositiveEv();
    } else if (state.activeTab === "arb-search") {
      loadArbSearch({ reset: true });
    } else if (state.activeTab === "low-hold") {
      loadLowHoldSearch({ reset: true });
    } else if (state.activeTab === "ev-search") {
      loadEvSearch({ reset: true });
    } else if (state.activeTab === "alerts") {
      loadAlertHits();
    }
  });
  dom.refreshHealth.addEventListener("click", loadIngestHealth);
  if (dom.runIngestBtn) {
    dom.runIngestBtn.addEventListener("click", startIngestFromUi);
  }
  if (dom.apiStart) {
    dom.apiStart.addEventListener("click", startApiHelper);
  }
  if (dom.workerStart) {
    dom.workerStart.addEventListener("click", startWorker);
  }
  if (dom.workerStop) {
    dom.workerStop.addEventListener("click", stopWorker);
  }
  dom.pills.forEach((pill) => {
    pill.addEventListener("click", () => setActiveTab(pill.dataset.tab));
  });
  dom.filterMarketKey.addEventListener("change", () => {
    loadFilterMeta();
    loadOddsScreen({ reset: true });
    if ((state.activeTab === "arb" || state.activeTab === "ev") && state.selectedEvent) {
      loadEventData();
    }
    if (state.activeTab === "arb-search") {
      loadArbSearch({ reset: true });
    }
    if (state.activeTab === "low-hold") {
      loadLowHoldSearch({ reset: true });
    }
    if (state.activeTab === "ev-search") {
      loadEvSearch({ reset: true });
    }
  });
  dom.filterPeriod.addEventListener("change", () => {
    loadOddsScreen({ reset: true });
    if ((state.activeTab === "arb" || state.activeTab === "ev") && state.selectedEvent) {
      loadEventData();
    }
    if (state.activeTab === "arb-search") {
      loadArbSearch({ reset: true });
    }
    if (state.activeTab === "low-hold") {
      loadLowHoldSearch({ reset: true });
    }
    if (state.activeTab === "ev-search") {
      loadEvSearch({ reset: true });
    }
  });
  dom.filterMinArb.addEventListener("change", () => {
    if (state.activeTab === "arb-search") {
      loadArbSearch({ reset: true });
    }
  });
  if (dom.arbBookmakerMode) {
    dom.arbBookmakerMode.addEventListener("change", () => {
      state.arbSearchBookmakerMode = dom.arbBookmakerMode.value || "include_selected";
      if (state.activeTab === "arb-search") {
        loadArbSearch({ reset: true });
      }
    });
  }
  if (dom.arbSearchMaxAgeSeconds) {
    dom.arbSearchMaxAgeSeconds.addEventListener("change", () => {
      const value = Number(dom.arbSearchMaxAgeSeconds.value);
      state.arbSearchMaxAgeSeconds = Number.isFinite(value) && value > 0 ? Math.floor(value) : null;
      if (state.activeTab === "arb-search") {
        renderArbSearch();
      }
    });
  }
  if (dom.arbSearchSort) {
    dom.arbSearchSort.addEventListener("change", () => {
      state.arbSearchSort = dom.arbSearchSort.value || "arb_desc";
      if (state.activeTab === "arb-search") {
        renderArbSearch();
      }
    });
  }
  if (dom.filterMaxOverround) {
    dom.filterMaxOverround.addEventListener("change", () => {
      if (state.activeTab === "low-hold") {
        loadLowHoldSearch({ reset: true });
      }
    });
  }
  dom.filterMinEv.addEventListener("change", () => {
    if (state.activeTab === "ev") {
      loadPositiveEv();
    } else if (state.activeTab === "ev-search") {
      loadEvSearch({ reset: true });
    }
  });
  dom.toggleIncludeNegative.addEventListener("change", () => {
    if (state.activeTab === "ev") {
      loadPositiveEv();
    } else if (state.activeTab === "ev-search") {
      loadEvSearch({ reset: true });
    }
  });
  if (dom.toggleAllowSingleBook) {
    dom.toggleAllowSingleBook.addEventListener("change", () => {
      if (state.activeTab === "ev") {
        loadPositiveEv();
      } else if (state.activeTab === "ev-search") {
        loadEvSearch({ reset: true });
      }
    });
  }
  dom.toggleOnlySelected.addEventListener("change", () => {
    if (state.activeTab === "odds") {
      renderOddsScreen();
    }
  });
  dom.toggleAutoRefresh.addEventListener("change", () => {
    state.oddsScreenAutoRefreshEnabled = dom.toggleAutoRefresh.checked;
    if (state.activeTab === "odds" && state.oddsScreenAutoRefreshEnabled) {
      startOddsScreenStream();
      loadOddsScreen({ reset: true, announce: false, showLoader: false });
    } else {
      stopOddsScreenStream();
    }
    updateLiveBadge();
  });
  if (dom.toggleArbSearchAutoRefresh) {
    dom.toggleArbSearchAutoRefresh.addEventListener("change", () => {
      state.arbSearchAutoRefreshEnabled = dom.toggleArbSearchAutoRefresh.checked;
      if (state.activeTab === "arb-search") {
        startArbSearchAutoRefresh();
        if (state.arbSearchAutoRefreshEnabled) {
          loadArbSearch({ reset: true });
        }
      } else {
        stopArbSearchAutoRefresh();
      }
    });
  }
  if (dom.arbSearchRefreshInterval) {
    dom.arbSearchRefreshInterval.addEventListener("change", () => {
      const value = Number(dom.arbSearchRefreshInterval.value);
      state.arbSearchRefreshIntervalMs = Number.isFinite(value) && value > 0 ? Math.floor(value) : 15000;
      if (state.activeTab === "arb-search" && state.arbSearchAutoRefreshEnabled) {
        startArbSearchAutoRefresh();
      }
    });
  }
  if (dom.toggleIncludeStale) {
    dom.toggleIncludeStale.addEventListener("change", () => {
      loadFilterMeta();
      loadEvents(true).then(() => {
        loadOddsScreen({ reset: true });
        if (state.activeTab === "arb-search") {
          loadArbSearch({ reset: true });
        }
        if (state.activeTab === "low-hold") {
          loadLowHoldSearch({ reset: true });
        }
        if (state.activeTab === "ev-search") {
          loadEvSearch({ reset: true });
        }
      });
    });
  }
  if (dom.toggleIncludeUnhealthy) {
    dom.toggleIncludeUnhealthy.addEventListener("change", () => {
      loadFilterMeta();
      loadEvents(true).then(() => {
        loadOddsScreen({ reset: true });
        if (state.activeTab === "arb-search") {
          loadArbSearch({ reset: true });
        }
        if (state.activeTab === "low-hold") {
          loadLowHoldSearch({ reset: true });
        }
        if (state.activeTab === "ev-search") {
          loadEvSearch({ reset: true });
        }
      });
    });
  }
  dom.savePreset.addEventListener("click", savePresetFromUI);
  dom.applyPreset.addEventListener("click", applySelectedPreset);
  dom.deletePreset.addEventListener("click", deleteSelectedPreset);
  dom.sharePreset.addEventListener("click", shareSelectedPreset);
  dom.exportPreset.addEventListener("click", exportSelectedPreset);
  dom.importPreset.addEventListener("click", importPreset);
  if (dom.saveAlert) {
    dom.saveAlert.addEventListener("click", saveAlertFromUI);
  }
  if (dom.scanAlert) {
    dom.scanAlert.addEventListener("click", scanSelectedAlert);
  }
  if (dom.deleteAlert) {
    dom.deleteAlert.addEventListener("click", deleteSelectedAlert);
  }
  if (dom.historyLookback) {
    dom.historyLookback.addEventListener("change", () => {
      state.oddsHistoryLookbackHours = getHistoryLookbackHours();
      if (state.oddsHistoryMode === "market" && state.oddsHistoryMarketId) {
        const context = state.oddsMarketContext.get(state.oddsHistoryMarketId);
        updateHistoryMeta(context);
        loadMarketHistory(state.oddsHistoryMarketId, { force: true });
        return;
      }
      if (state.oddsHistoryOutcomeId) {
        const context = state.oddsOutcomeContext.get(state.oddsHistoryOutcomeId);
        updateHistoryMeta(context);
        loadOddsHistory(state.oddsHistoryOutcomeId, { force: true });
      }
    });
  }
  if (dom.historyMaxPoints) {
    dom.historyMaxPoints.addEventListener("change", () => {
      state.oddsHistoryMaxPoints = getHistoryMaxPoints();
      if (state.oddsHistoryMode === "market" && state.oddsHistoryMarketId) {
        const context = state.oddsMarketContext.get(state.oddsHistoryMarketId);
        updateHistoryMeta(context);
        loadMarketHistory(state.oddsHistoryMarketId, { force: true });
        return;
      }
      if (state.oddsHistoryOutcomeId) {
        const context = state.oddsOutcomeContext.get(state.oddsHistoryOutcomeId);
        updateHistoryMeta(context);
        loadOddsHistory(state.oddsHistoryOutcomeId, { force: true });
      }
    });
  }
  if (dom.historyClose) {
    dom.historyClose.addEventListener("click", closeHistoryModal);
  }
  if (dom.historyModal) {
    dom.historyModal.addEventListener("click", (event) => {
      if (event.target === dom.historyModal) {
        closeHistoryModal();
      }
    });
  }
  dom.presetSelect.addEventListener("change", () => {
    const selectedId = Number(dom.presetSelect.value || 0);
    const preset = state.presets.find((item) => item.id === selectedId);
    dom.presetName.value = preset ? preset.name : "";
  });
  if (dom.alertSelect) {
    dom.alertSelect.addEventListener("change", () => {
      const alert = getSelectedAlert();
      dom.alertName.value = alert ? alert.name : "";
      if (dom.alertType) {
        dom.alertType.value = alert ? alert.alert_type : "arbitrage";
      }
      updateHeader();
      if (state.activeTab === "alerts") {
        loadAlertHits();
      }
    });
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dom.historyModal && dom.historyModal.classList.contains("show")) {
      closeHistoryModal();
    }
  });
}

async function importSharedPreset(token) {
  try {
    const preset = await fetchJson(`/presets/shared/${token}`);
    const payload = extractPresetPayload(preset);
    if (!payload || !payload.filters) {
      showToast("Shared preset invalid");
      return;
    }
    const presetName = uniquePresetName(preset.name || "Shared preset");
    const saved = await requestJson("/presets", "POST", {
      name: presetName,
      payload,
    });
    upsertPresetInState(saved);
    dom.presetSelect.value = String(saved.id);
    dom.presetName.value = saved.name;
    applyPreset(saved.payload || saved);
    showToast(`Shared preset imported: ${saved.name}`);
    showPresetImportNotice(saved.name);
    const url = new URL(window.location.href);
    url.searchParams.delete("preset_token");
    window.history.replaceState(null, "", url.pathname + url.search);
  } catch (err) {
    showToast("Failed to import shared preset");
  }
}

async function init() {
  attachEvents();
  setActiveTab("odds");
  await loadIngestHealth();
  await loadApiStatus();
  await loadPresetsFromServer();
  await loadAlertsFromServer();
  loadBookmakers();
  await loadEvents(true);
  const params = new URLSearchParams(window.location.search);
  const sharedToken = params.get("preset_token");
  if (sharedToken) {
    await importSharedPreset(sharedToken);
  }
}

init();

