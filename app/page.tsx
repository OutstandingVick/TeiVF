"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Currency = "NGN" | "USD";

type MarketTuple = [string, string, string, string, number, string, string];

type Market = {
  id: string;
  question: string;
  match: string;
  clock: string;
  copy: string;
  probability: number;
  yesLabel: string;
  noLabel: string;
  volume: number;
  series: number[];
  injected?: boolean;
};

type TradeSelection = {
  market: Market;
  side: string;
};

const marketSeeds: MarketTuple[] = [
  ["NEXT GOAL?", "LIV vs MCI", "63:14", "Goal before 70:00 is pulling heavy volume after two quick shots.", 62, "YES", "NO"],
  ["OVER 9.5 CORNERS?", "ARS vs CHE", "78:02", "Chelsea pressure is rising, but Arsenal are slowing the tempo.", 54, "OVER", "UNDER"],
  ["CARD BEFORE 75?", "LIV vs MCI", "63:14", "Midfield fouls are climbing. Ref has warned both benches.", 47, "YES", "NO"],
  ["PENALTY?", "INT vs JUV", "HT", "Low box entries so far, but both wingbacks are drawing contact.", 18, "YES", "NO"],
  ["SHOT ON TARGET?", "ARS vs CHE", "78:02", "Next three minutes favor Chelsea from the left channel.", 71, "YES", "NO"],
  ["2ND HALF GOALS?", "INT vs JUV", "HT", "Both teams are holding shape, but substitutions are warming up.", 58, "OVER", "UNDER"],
  ["VAR CHECK?", "LIV vs MCI", "63:14", "The match has entered a high-contact phase around the box.", 22, "YES", "NO"],
  ["KEEPER SAVE?", "ARS vs CHE", "78:02", "Fast counter pattern active after Arsenal lose possession.", 39, "YES", "NO"]
];

const injectedSeeds: MarketTuple[] = [
  ["GOAL FROM CORNER?", "LIV vs MCI", "63:51", "Corner awarded. First contact market is moving fast.", 31, "YES", "NO"],
  ["FREE KICK SHOT?", "ARS vs CHE", "79:12", "Dangerous central free kick, 24 meters out.", 44, "YES", "NO"],
  ["NEXT THROW-IN HOME?", "INT vs JUV", "47:08", "Play compressed near the right touchline.", 52, "YES", "NO"]
];

const matchPills = [
  ["LIV", "1", "63:14", "1", "MCI"],
  ["ARS", "2", "78:02", "0", "CHE"],
  ["INT", "0", "HT", "0", "JUV"]
];

const currencyLocales: Record<Currency, string> = {
  NGN: "en-NG",
  USD: "en-US"
};

const walletBalances: Record<Currency, number> = {
  NGN: 24800,
  USD: 16.5
};

const stakePresets: Record<Currency, Array<[string, string]>> = {
  NGN: [
    ["₦500", "500"],
    ["₦1K", "1000"],
    ["₦5K", "5000"]
  ],
  USD: [
    ["$1", "1"],
    ["$5", "5"],
    ["$10", "10"]
  ]
};

const currencyRateFromNgn: Record<Currency, number> = {
  NGN: 1,
  USD: 1 / 1500
};

const payoutUnit: Record<Currency, number> = {
  NGN: 1,
  USD: 1
};

function convertFromNgn(amount: number, currency: Currency) {
  return amount * currencyRateFromNgn[currency];
}

function formatMoney(amount: number, currency: Currency, notation: "standard" | "compact" = "standard") {
  return new Intl.NumberFormat(currencyLocales[currency], {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: currency === "NGN" ? 0 : 2
  }).format(amount);
}

function formatMatchedVolume(volumeInThousandsNgn: number, currency: Currency) {
  return `${formatMoney(convertFromNgn(volumeInThousandsNgn * 1000, currency), currency, "compact")} matched`;
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

function makeSeries(seed: number) {
  let value = seed;
  return Array.from({ length: 26 }, (_, index) => {
    value += Math.sin(index * 1.7 + seed) * 2.2 + (Math.random() - 0.48) * 7;
    return Math.max(6, Math.min(94, value));
  });
}

function sparkPath(series: number[]) {
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

function marketFromTuple(tuple: MarketTuple, id: string, injected = false): Market {
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

function makePage(page: number) {
  return Array.from({ length: 6 }, (_, index) => {
    const tuple = marketSeeds[(page * 3 + index) % marketSeeds.length];
    return marketFromTuple(tuple, `m-${page}-${index}-${Date.now()}`);
  });
}

function updateMarket(market: Market): Market {
  const shift = Math.round((Math.random() - 0.47) * 7);
  const probability = Math.max(5, Math.min(95, market.probability + shift));
  return {
    ...market,
    probability,
    volume: market.volume + Math.round(Math.random() * 18),
    series: market.series.slice(1).concat(probability)
  };
}

function TeiLogo() {
  return (
    <svg className="tei-logo" viewBox="0 0 128 82" role="img" aria-hidden="true">
      <polygon className="logo-green" points="24 12 84 12 76 30 59 30 37 70 8 70 33 30 16 30" />
      <polygon className="logo-white" points="82 12 117 12 109 30 96 30 76 70 43 70 51 52 64 52 75 30" />
      <polygon className="logo-obsidian" points="71 30 86 30 78 48 63 48" />
      <polygon className="logo-obsidian" points="58 52 75 52 67 70 50 70" />
      <polygon className="logo-white" points="86 34 112 34 105 49 79 49" />
      <polygon className="logo-white" points="75 55 102 55 95 70 68 70" />
    </svg>
  );
}

function Topbar({ currency, onCurrencyChange, onToggleTheme }: { currency: Currency; onCurrencyChange: (currency: Currency) => void; onToggleTheme: () => void }) {
  return (
    <header className="topbar">
      <a className="velocity-mark" aria-label="Tei home" href="#">
        <TeiLogo />
      </a>
      <div className="match-strip" aria-label="Live match selector">
        {matchPills.map(([home, homeScore, clock, awayScore, away], index) => (
          <button className={`match-pill ${index === 0 ? "active" : ""}`} type="button" key={`${home}-${away}`}>
            <span>{home}</span>
            <strong>{homeScore}</strong>
            <small>{clock}</small>
            <strong>{awayScore}</strong>
            <span>{away}</span>
          </button>
        ))}
      </div>
      <WalletBar currency={currency} onCurrencyChange={onCurrencyChange} />
      <button className="theme-toggle" type="button" aria-label="Toggle color mode" onClick={onToggleTheme}>
        ◐
      </button>
    </header>
  );
}

function WalletBar({ currency, onCurrencyChange }: { currency: Currency; onCurrencyChange: (currency: Currency) => void }) {
  return (
    <div className="wallet-shell" aria-label="Wallet summary">
      <div className="wallet-balance">
        <span>Balance</span>
        <strong>{formatMoney(walletBalances[currency], currency)}</strong>
      </div>
      <div className="currency-toggle" aria-label="Display currency">
        {(["NGN", "USD"] as Currency[]).map((code) => (
          <button className={currency === code ? "active" : ""} type="button" key={code} onClick={() => onCurrencyChange(code)}>
            {code}
          </button>
        ))}
      </div>
      <button className="wallet-action" type="button">
        Add Cash
      </button>
      <button className="wallet-action muted" type="button">
        Cash Out
      </button>
    </div>
  );
}

function MarketCard({ market, currency, onTrade }: { market: Market; currency: Currency; onTrade: (market: Market, side: string) => void }) {
  return (
    <article className={`market-card ${market.injected ? "injected" : ""}`} data-testid="market-card">
      <div className="ticker-header">
        <div>
          <span className="clock">{market.clock} LIVE</span>
          <h2 className="market-question">{market.question}</h2>
        </div>
        <div className="market-meta">
          <span>{market.match}</span>
          <strong className="price">{market.probability}%</strong>
          <span>{formatMatchedVolume(market.volume, currency)}</span>
        </div>
      </div>
      <div className="card-body">
        <p className="body-copy">
          <strong>Micro-moment</strong>
          {market.copy}
        </p>
        <svg className="sparkline" viewBox="0 0 160 86" role="img" aria-label="Live odds movement">
          <path d={sparkPath(market.series)} />
        </svg>
      </div>
      <div className="action-zones">
        <button className="zone zone-yes" type="button" onClick={() => onTrade(market, market.yesLabel)}>
          <span>{market.yesLabel}</span>
          <small>{market.probability} / {formatMoney(payoutUnit[currency], currency)}</small>
        </button>
        <button className="zone zone-no" type="button" onClick={() => onTrade(market, market.noLabel)}>
          <span>{market.noLabel}</span>
          <small>{100 - market.probability} / {formatMoney(payoutUnit[currency], currency)}</small>
        </button>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-line mid" />
      <div className="skeleton-line big" />
      <div className="skeleton-line" />
      <div className="skeleton-line mid" />
      <div className="skeleton-actions">
        <span />
        <span />
      </div>
    </div>
  );
}

function MarketPulsePanel({ currency }: { currency: Currency }) {
  return (
    <aside className="desk-panel" aria-label="Market pulse">
      <div className="panel-section">
        <p className="eyebrow">Pulse</p>
        <h2>Market heat</h2>
        <div className="heat-meter">
          <span style={{ width: "72%" }} />
        </div>
        <p className="panel-copy">Fastest moves are clustered around corners, next goal, and cards.</p>
      </div>
      <div className="panel-section compact-stats">
        <div>
          <span>Volume</span>
          <strong>{formatMoney(convertFromNgn(8400000, currency), currency, "compact")}</strong>
        </div>
        <div>
          <span>Spread</span>
          <strong>4.2%</strong>
        </div>
        <div>
          <span>Latency</span>
          <strong>42ms</strong>
        </div>
      </div>
    </aside>
  );
}

function TradeTray({ selection, currency, stake, setStake, onClose }: { selection: TradeSelection | null; currency: Currency; stake: string; setStake: (value: string) => void; onClose: () => void }) {
  const [burning, setBurning] = useState(false);
  const estimate = useMemo(() => {
    if (!selection) return 0;
    const stakeValue = Number(stake.replace(/\D/g, "")) || 0;
    const yesPrice = selection.market.probability / 100;
    const price = selection.side === "NO" || selection.side === "UNDER" ? 1 - yesPrice : yesPrice;
    return Math.round(stakeValue / Math.max(0.05, price));
  }, [selection, stake]);

  function placeTrade() {
    setBurning(true);
    vibrate([28, 20, 28]);
    window.setTimeout(() => {
      setBurning(false);
      onClose();
    }, 660);
  }

  return (
    <>
      <div className="tray-backdrop" hidden={!selection} onClick={onClose} />
      <aside className={`trade-tray ${selection ? "open" : ""}`} aria-hidden={!selection} aria-label="Trade ticket">
        <div className="tray-grip" />
        <div className="tray-market">
          <p className="eyebrow" id="tray-side" style={{ color: selection?.side === "NO" || selection?.side === "UNDER" ? "var(--red)" : "var(--lime)" }}>
            {selection?.side ?? "YES"}
          </p>
          <h2 id="tray-question">{selection?.market.question ?? "NEXT GOAL?"}</h2>
          <span id="tray-match">{selection ? `${selection.market.match} · ${selection.market.clock}` : "LIV vs MCI · 63:14"}</span>
        </div>
        <div className="stake-row">
          {[...stakePresets[currency], ["MAX", stake] as [string, string]].map(([label, value]) => (
            <button type="button" key={label} onClick={() => setStake(value)}>
              {label}
            </button>
          ))}
        </div>
        <label className="stake-input">
          <span>Stake</span>
          <input id="stake" value={stake} inputMode="numeric" onChange={(event) => setStake(event.target.value)} />
        </label>
        <div className="quote-box">
          <span>Est. return</span>
          <strong id="tray-return">{formatMoney(estimate, currency)}</strong>
        </div>
        <button className={`place-bet ${burning ? "burn" : ""}`} id="place-bet" type="button" onClick={placeTrade}>
          Place Bet
        </button>
      </aside>
    </>
  );
}

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selection, setSelection] = useState<TradeSelection | null>(null);
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [stake, setStake] = useState("2500");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  function appendPage() {
    setLoadingMore(true);
    window.setTimeout(() => {
      setMarkets((current) => current.concat(makePage(page)));
      setPage((current) => current + 1);
      setLoadingMore(false);
    }, 420);
  }

  function openTrade(market: Market, side: string) {
    setSelection({ market, side });
    vibrate(35);
  }

  function closeTrade() {
    setSelection(null);
  }

  function changeCurrency(nextCurrency: Currency) {
    setCurrency(nextCurrency);
    setStake(nextCurrency === "NGN" ? "2500" : "5");
  }

  function toggleTheme() {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  }

  useEffect(() => {
    appendPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tick = window.setInterval(() => {
      setMarkets((current) => current.map(updateMarket));
    }, 1400);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    const inject = window.setInterval(() => {
      const tuple = injectedSeeds[Math.floor(Math.random() * injectedSeeds.length)];
      const market = marketFromTuple(tuple, `i-${Date.now()}`, true);
      setMarkets((current) => [market, ...current].slice(0, 42));
      vibrate([24, 30, 44]);
    }, 9000);
    return () => window.clearInterval(inject);
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting) && !loadingMore) appendPage();
    });
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingMore, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const card = entry.target as HTMLElement;
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
    return () => observer.disconnect();
  }, [markets.length]);

  return (
    <div id="app">
      <Topbar currency={currency} onCurrencyChange={changeCurrency} onToggleTheme={toggleTheme} />
      <main className="layout">
        <section className="feed-shell" aria-labelledby="feed-title">
          <div className="feed-head">
            <div>
              <p className="eyebrow">Trade the match</p>
              <h1 id="feed-title">Match Moments</h1>
            </div>
            <div className="live-chip">
              <span /> 24 live markets
            </div>
          </div>
          <div className="hot-zone-rail" aria-hidden="true" />
          <div id="feed" className="feed" aria-live="polite">
            {markets.map((market) => (
              <MarketCard key={market.id} market={market} currency={currency} onTrade={openTrade} />
            ))}
            {loadingMore ? <SkeletonCard /> : null}
          </div>
          <div id="sentinel" className="sentinel" aria-hidden="true" ref={sentinelRef} />
        </section>
        <MarketPulsePanel currency={currency} />
      </main>
      <TradeTray selection={selection} currency={currency} stake={stake} setStake={setStake} onClose={closeTrade} />
    </div>
  );
}
