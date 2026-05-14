const feed = document.querySelector("#feed");
const sentinel = document.querySelector("#sentinel");
const tray = document.querySelector(".trade-tray");
const backdrop = document.querySelector(".tray-backdrop");
const traySide = document.querySelector("#tray-side");
const trayQuestion = document.querySelector("#tray-question");
const trayMatch = document.querySelector("#tray-match");
const trayReturn = document.querySelector("#tray-return");
const stakeInput = document.querySelector("#stake");
const placeBet = document.querySelector("#place-bet");
const themeToggle = document.querySelector(".theme-toggle");

const markets = [
  ["NEXT GOAL?", "LIV vs MCI", "63:14", "Goal before 70:00 is pulling heavy volume after two quick shots.", 62, "YES", "NO"],
  ["OVER 9.5 CORNERS?", "ARS vs CHE", "78:02", "Chelsea pressure is rising, but Arsenal are slowing the tempo.", 54, "OVER", "UNDER"],
  ["CARD BEFORE 75?", "LIV vs MCI", "63:14", "Midfield fouls are climbing. Ref has warned both benches.", 47, "YES", "NO"],
  ["PENALTY?", "INT vs JUV", "HT", "Low box entries so far, but both wingbacks are drawing contact.", 18, "YES", "NO"],
  ["SHOT ON TARGET?", "ARS vs CHE", "78:02", "Next three minutes favor Chelsea from the left channel.", 71, "YES", "NO"],
  ["2ND HALF GOALS?", "INT vs JUV", "HT", "Both teams are holding shape, but substitutions are warming up.", 58, "OVER", "UNDER"],
  ["VAR CHECK?", "LIV vs MCI", "63:14", "The match has entered a high-contact phase around the box.", 22, "YES", "NO"],
  ["KEEPER SAVE?", "ARS vs CHE", "78:02", "Fast counter pattern active after Arsenal lose possession.", 39, "YES", "NO"]
];

const injections = [
  ["GOAL FROM CORNER?", "LIV vs MCI", "63:51", "Corner awarded. First contact market is moving fast.", 31, "YES", "NO"],
  ["FREE KICK SHOT?", "ARS vs CHE", "79:12", "Dangerous central free kick, 24 meters out.", 44, "YES", "NO"],
  ["NEXT THROW-IN HOME?", "INT vs JUV", "47:08", "Play compressed near the right touchline.", 52, "YES", "NO"]
];

let cards = [];
let page = 0;
let selectedMarket = null;

function vibrate(pattern) {
  if ("vibrate" in navigator) navigator.vibrate(pattern);
}

function makeSeries(seed) {
  let value = seed;
  return Array.from({ length: 26 }, (_, index) => {
    value += Math.sin(index * 1.7 + seed) * 2.2 + (Math.random() - 0.48) * 7;
    return Math.max(6, Math.min(94, value));
  });
}

function sparkPath(series) {
  const width = 160;
  const height = 86;
  const step = width / (series.length - 1);
  return series
    .map((point, index) => {
      const x = Math.round(index * step);
      const y = Math.round(height - (point / 100) * height);
      return `${index === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ");
}

function marketFromTuple(tuple, id, injected = false) {
  const [question, match, clock, copy, probability, yesLabel, noLabel] = tuple;
  return {
    id,
    question,
    match,
    clock,
    copy,
    probability,
    yesLabel,
    noLabel,
    volume: Math.round(420 + Math.random() * 950),
    series: makeSeries(probability),
    injected
  };
}

function cardTemplate(market) {
  return `
    <article class="market-card ${market.injected ? "injected" : ""}" data-id="${market.id}" data-testid="market-card">
      <div class="ticker-header">
        <div>
          <span class="clock">${market.clock} LIVE</span>
          <h2 class="market-question">${market.question}</h2>
        </div>
        <div class="market-meta">
          <span>${market.match}</span>
          <strong class="price">${market.probability}%</strong>
          <span>₦${market.volume}K matched</span>
        </div>
      </div>
      <div class="card-body">
        <p class="body-copy"><strong>Micro-moment</strong>${market.copy}</p>
        <svg class="sparkline" viewBox="0 0 160 86" role="img" aria-label="Live odds movement">
          <path d="${sparkPath(market.series)}"></path>
        </svg>
      </div>
      <div class="action-zones">
        <button class="zone zone-yes" data-side="${market.yesLabel}" type="button">
          <span>${market.yesLabel}</span>
          <small>${market.probability} / ₦1</small>
        </button>
        <button class="zone zone-no" data-side="${market.noLabel}" type="button">
          <span>${market.noLabel}</span>
          <small>${100 - market.probability} / ₦1</small>
        </button>
      </div>
    </article>
  `;
}

function skeletonTemplate() {
  return `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton-line mid"></div>
      <div class="skeleton-line big"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line mid"></div>
      <div class="skeleton-actions"><span></span><span></span></div>
    </div>
  `;
}

function render() {
  feed.innerHTML = cards.map(cardTemplate).join("");
  observeCards();
}

function appendPage() {
  const skeleton = document.createElement("div");
  skeleton.innerHTML = skeletonTemplate();
  feed.append(skeleton.firstElementChild);

  window.setTimeout(() => {
    const next = Array.from({ length: 6 }, (_, index) => {
      const tuple = markets[(page * 3 + index) % markets.length];
      return marketFromTuple(tuple, `m-${page}-${index}-${Date.now()}`);
    });
    cards = cards.concat(next);
    page += 1;
    render();
  }, 420);
}

function injectMarket() {
  const tuple = injections[Math.floor(Math.random() * injections.length)];
  const market = marketFromTuple(tuple, `i-${Date.now()}`, true);
  cards = [market, ...cards].slice(0, 42);
  render();
  vibrate([24, 30, 44]);
}

function updateMarketData() {
  cards = cards.map((market) => {
    const shift = Math.round((Math.random() - 0.47) * 7);
    const probability = Math.max(5, Math.min(95, market.probability + shift));
    const series = market.series.slice(1).concat(probability);
    return {
      ...market,
      probability,
      volume: market.volume + Math.round(Math.random() * 18),
      series
    };
  });

  document.querySelectorAll(".market-card").forEach((card) => {
    const market = cards.find((item) => item.id === card.dataset.id);
    if (!market) return;
    card.querySelector(".price").textContent = `${market.probability}%`;
    card.querySelector(".sparkline path").setAttribute("d", sparkPath(market.series));
    card.querySelector(".zone-yes small").textContent = `${market.probability} / ₦1`;
    card.querySelector(".zone-no small").textContent = `${100 - market.probability} / ₦1`;
    card.querySelector(".market-meta span:last-child").textContent = `₦${market.volume}K matched`;
  });
}

function openTray(market, side) {
  selectedMarket = { market, side };
  traySide.textContent = side;
  traySide.style.color = side === "NO" || side === "UNDER" ? "var(--red)" : "var(--lime)";
  trayQuestion.textContent = market.question;
  trayMatch.textContent = `${market.match} · ${market.clock}`;
  updateReturn();
  backdrop.hidden = false;
  tray.classList.add("open");
  tray.setAttribute("aria-hidden", "false");
  vibrate(35);
}

function closeTray() {
  tray.classList.remove("open");
  tray.setAttribute("aria-hidden", "true");
  backdrop.hidden = true;
}

function updateReturn() {
  if (!selectedMarket) return;
  const stake = Number(stakeInput.value.replace(/\D/g, "")) || 0;
  const yesPrice = selectedMarket.market.probability / 100;
  const price = selectedMarket.side === "NO" || selectedMarket.side === "UNDER" ? 1 - yesPrice : yesPrice;
  const estimated = Math.round(stake / Math.max(0.05, price));
  trayReturn.textContent = `₦${estimated.toLocaleString("en-NG")}`;
}

function observeCards() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const card = entry.target;
        if (!entry.isIntersecting) {
          card.classList.remove("hot");
          return;
        }
        const rect = card.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const hot = center > window.innerHeight * 0.38 && center < window.innerHeight * 0.62;
        card.classList.toggle("hot", hot);
        if (hot && card.dataset.haptic !== "true") {
          card.dataset.haptic = "true";
          vibrate(45);
        }
      });
    },
    { threshold: [0.45, 0.7] }
  );

  document.querySelectorAll(".market-card").forEach((card) => observer.observe(card));
}

feed.addEventListener("click", (event) => {
  const zone = event.target.closest(".zone");
  if (!zone) return;
  const card = zone.closest(".market-card");
  const market = cards.find((item) => item.id === card.dataset.id);
  if (market) openTray(market, zone.dataset.side);
});

backdrop.addEventListener("click", closeTray);

stakeInput.addEventListener("input", updateReturn);

document.querySelector(".stake-row").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const value = button.textContent.replace("₦", "").replace("K", "000");
  if (value !== "MAX") stakeInput.value = value;
  updateReturn();
});

placeBet.addEventListener("click", () => {
  placeBet.classList.add("burn");
  vibrate([28, 20, 28]);
  window.setTimeout(() => {
    placeBet.classList.remove("burn");
    closeTray();
  }, 660);
});

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
});

const feedObserver = new IntersectionObserver((entries) => {
  if (entries.some((entry) => entry.isIntersecting)) appendPage();
});

feedObserver.observe(sentinel);
appendPage();
window.setInterval(updateMarketData, 1400);
window.setInterval(injectMarket, 9000);
