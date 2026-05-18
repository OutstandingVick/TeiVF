import { type Currency, formatMatchedVolume, formatMoney, payoutUnit } from "../lib/currency";
import { type Market } from "../lib/markets";
import { sparkPath } from "../lib/sparkline";

export function MarketCard({ market, currency, onTrade }: { market: Market; currency: Currency; onTrade: (market: Market, side: string) => void }) {
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
