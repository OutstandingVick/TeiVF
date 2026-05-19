import { type Currency } from "../lib/currency";
import { matchPills } from "../lib/markets";
import { TeiLogo } from "./TeiLogo";
import { type WalletState } from "../lib/wallet";
import { WalletBar } from "./WalletBar";

export function Topbar({ currency, wallet, onCurrencyChange, onWalletToggle, onToggleTheme }: { currency: Currency; wallet: WalletState; onCurrencyChange: (currency: Currency) => void; onWalletToggle: () => void; onToggleTheme: () => void }) {
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
      <WalletBar currency={currency} wallet={wallet} onCurrencyChange={onCurrencyChange} onWalletToggle={onWalletToggle} />
      <button className="theme-toggle" type="button" aria-label="Toggle color mode" onClick={onToggleTheme}>
        ◐
      </button>
    </header>
  );
}
