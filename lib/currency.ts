export type Currency = "NGN" | "USD";

export const currencyLocales: Record<Currency, string> = {
  NGN: "en-NG",
  USD: "en-US"
};

export const walletBalances: Record<Currency, number> = {
  NGN: 24800,
  USD: 16.5
};

export const stakePresets: Record<Currency, Array<[string, string]>> = {
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

export const payoutUnit: Record<Currency, number> = {
  NGN: 1,
  USD: 1
};

const currencyRateFromNgn: Record<Currency, number> = {
  NGN: 1,
  USD: 1 / 1500
};

export function convertFromNgn(amount: number, currency: Currency) {
  return amount * currencyRateFromNgn[currency];
}

export function formatMoney(amount: number, currency: Currency, notation: "standard" | "compact" = "standard") {
  return new Intl.NumberFormat(currencyLocales[currency], {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: currency === "NGN" ? 0 : 2
  }).format(amount);
}

export function formatMatchedVolume(volumeInThousandsNgn: number, currency: Currency) {
  return `${formatMoney(convertFromNgn(volumeInThousandsNgn * 1000, currency), currency, "compact")} matched`;
}
