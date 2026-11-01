/**
 * Audit scoring. Pure functions, no database, fully unit tested.
 *
 * Each dimension has criteria rated 0-4. The dimension score is the weighted
 * mean of its ratings, scaled to 0-100. The overall score is the plain mean
 * of the seven dimension scores.
 */

export type Band = "critical" | "developing" | "strong";

export const BAND_LABEL: Record<Band, string> = {
  critical: "Critical",
  developing: "Developing",
  strong: "Strong",
};

export const DIMENSIONS = [
  { key: "market", label: "Market and customer" },
  { key: "brand", label: "Brand and positioning" },
  { key: "messaging", label: "Messaging and content" },
  { key: "channels", label: "Channels and presence" },
  { key: "conversion", label: "Conversion and sales enablement" },
  { key: "measurement", label: "Measurement and data" },
  { key: "capability", label: "Capability and coordination" },
] as const;

export type DimensionKey = (typeof DIMENSIONS)[number]["key"];

export const MAX_RATING = 4;

export function bandFor(score: number): Band {
  if (score < 40) return "critical";
  if (score < 70) return "developing";
  return "strong";
}

export type CriterionRating = { rating: number; weight?: number };

/** 0-100. Returns null when no criteria are rated yet. */
export function dimensionScore(criteria: CriterionRating[]): number | null {
  const rated = criteria.filter((c) => Number.isFinite(c.rating));
  if (rated.length === 0) return null;
  let weighted = 0;
  let totalWeight = 0;
  for (const c of rated) {
    const w = c.weight ?? 1;
    const r = Math.min(MAX_RATING, Math.max(0, c.rating));
    weighted += r * w;
    totalWeight += w;
  }
  if (totalWeight === 0) return null;
  return Math.round((weighted / (totalWeight * MAX_RATING)) * 100);
}

/** Plain mean of the dimension scores that exist. Null if none do. */
export function overallScore(scores: Array<number | null>): number | null {
  const present = scores.filter((s): s is number => s !== null);
  if (present.length === 0) return null;
  return Math.round(present.reduce((a, b) => a + b, 0) / present.length);
}
