import { type Currency } from "../lib/currency";
import { matchPills } from "../lib/markets";
import { TeiLogo } from "./TeiLogo";
import { WalletBar } from "./WalletBar";

export function Topbar({ currency, onCurrencyChange, onToggleTheme }: { currency: Currency; onCurrencyChange: (currency: Currency) => void; onToggleTheme: () => void }) {
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
