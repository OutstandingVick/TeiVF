import { type Currency, formatMoney, walletBalances } from "../lib/currency";
import { type WalletState, shortenAddress } from "../lib/wallet";

export function WalletBar({ currency, wallet, onCurrencyChange, onWalletToggle }: { currency: Currency; wallet: WalletState; onCurrencyChange: (currency: Currency) => void; onWalletToggle: () => void }) {
  return (
    <div className="wallet-shell" aria-label="Wallet summary">
      <div className="wallet-balance">
        <span>{wallet.balanceSource}</span>
        <strong>{formatMoney(walletBalances[currency], currency)}</strong>
      </div>
      <div className="currency-toggle" aria-label="Display currency">
        {(["NGN", "USD"] as Currency[]).map((code) => (
          <button className={currency === code ? "active" : ""} type="button" key={code} onClick={() => onCurrencyChange(code)}>
            {code}
          </button>
        ))}
      </div>
      <button className="wallet-connect" type="button" onClick={onWalletToggle}>
        <span>{wallet.network}</span>
        <strong>{wallet.connected && wallet.address ? shortenAddress(wallet.address) : "Connect Wallet"}</strong>
      </button>
      <button className="wallet-action" type="button">
        Add Cash
      </button>
      <button className="wallet-action muted" type="button">
        Cash Out
      </button>
    </div>
  );
}
