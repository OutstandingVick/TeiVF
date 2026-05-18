import { type Currency, formatMoney, walletBalances } from "../lib/currency";

export function WalletBar({ currency, onCurrencyChange }: { currency: Currency; onCurrencyChange: (currency: Currency) => void }) {
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
