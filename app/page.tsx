"use client";

import { useEffect, useRef, useState } from "react";
import { MarketCard } from "../components/MarketCard";
import { MarketPulsePanel } from "../components/MarketPulsePanel";
import { SkeletonCard } from "../components/SkeletonCard";
import { Topbar } from "../components/Topbar";
import { TradeTray } from "../components/TradeTray";
import { type Currency } from "../lib/currency";
import { vibrate } from "../lib/haptics";
import { injectedSeeds, type Market, marketFromTuple, makePage, type TradeSelection, updateMarket } from "../lib/markets";

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
