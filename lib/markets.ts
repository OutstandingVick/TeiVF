export type MarketTuple = [string, string, string, string, number, string, string];

export type Market = {
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

export type TradeSelection = {
  market: Market;
  side: string;
};

export const marketSeeds: MarketTuple[] = [
  ["NEXT GOAL?", "LIV vs MCI", "63:14", "Goal before 70:00 is pulling heavy volume after two quick shots.", 62, "YES", "NO"],
  ["OVER 9.5 CORNERS?", "ARS vs CHE", "78:02", "Chelsea pressure is rising, but Arsenal are slowing the tempo.", 54, "OVER", "UNDER"],
  ["CARD BEFORE 75?", "LIV vs MCI", "63:14", "Midfield fouls are climbing. Ref has warned both benches.", 47, "YES", "NO"],
  ["PENALTY?", "INT vs JUV", "HT", "Low box entries so far, but both wingbacks are drawing contact.", 18, "YES", "NO"],
  ["SHOT ON TARGET?", "ARS vs CHE", "78:02", "Next three minutes favor Chelsea from the left channel.", 71, "YES", "NO"],
  ["2ND HALF GOALS?", "INT vs JUV", "HT", "Both teams are holding shape, but substitutions are warming up.", 58, "OVER", "UNDER"],
  ["VAR CHECK?", "LIV vs MCI", "63:14", "The match has entered a high-contact phase around the box.", 22, "YES", "NO"],
  ["KEEPER SAVE?", "ARS vs CHE", "78:02", "Fast counter pattern active after Arsenal lose possession.", 39, "YES", "NO"]
];

export const injectedSeeds: MarketTuple[] = [
  ["GOAL FROM CORNER?", "LIV vs MCI", "63:51", "Corner awarded. First contact market is moving fast.", 31, "YES", "NO"],
  ["FREE KICK SHOT?", "ARS vs CHE", "79:12", "Dangerous central free kick, 24 meters out.", 44, "YES", "NO"],
  ["NEXT THROW-IN HOME?", "INT vs JUV", "47:08", "Play compressed near the right touchline.", 52, "YES", "NO"]
];

export const matchPills = [
  ["LIV", "1", "63:14", "1", "MCI"],
  ["ARS", "2", "78:02", "0", "CHE"],
  ["INT", "0", "HT", "0", "JUV"]
];

export function makeSeries(seed: number) {
  let value = seed;
  return Array.from({ length: 26 }, (_, index) => {
    value += Math.sin(index * 1.7 + seed) * 2.2 + (Math.random() - 0.48) * 7;
    return Math.max(6, Math.min(94, value));
  });
}

export function marketFromTuple(tuple: MarketTuple, id: string, injected = false): Market {
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

export function makePage(page: number) {
  return Array.from({ length: 6 }, (_, index) => {
    const tuple = marketSeeds[(page * 3 + index) % marketSeeds.length];
    return marketFromTuple(tuple, `m-${page}-${index}-${Date.now()}`);
  });
}

export function updateMarket(market: Market): Market {
  const shift = Math.round((Math.random() - 0.47) * 7);
  const probability = Math.max(5, Math.min(95, market.probability + shift));
  return {
    ...market,
    probability,
    volume: market.volume + Math.round(Math.random() * 18),
    series: market.series.slice(1).concat(probability)
  };
}
