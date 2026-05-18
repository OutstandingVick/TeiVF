import { useMemo, useState } from "react";
import { type Currency, formatMoney, stakePresets } from "../lib/currency";
import { type TradeSelection } from "../lib/markets";
import { vibrate } from "../lib/haptics";

export function TradeTray({ selection, currency, stake, setStake, onClose }: { selection: TradeSelection | null; currency: Currency; stake: string; setStake: (value: string) => void; onClose: () => void }) {
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
