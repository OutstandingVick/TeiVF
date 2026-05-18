import { type Currency, convertFromNgn, formatMoney } from "../lib/currency";

export function MarketPulsePanel({ currency }: { currency: Currency }) {
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
