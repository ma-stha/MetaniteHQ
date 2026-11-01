import { describe, expect, it } from "vitest";
import { bandFor, dimensionScore, overallScore } from "@/lib/scoring";

describe("bandFor", () => {
  it("maps edges correctly", () => {
    expect(bandFor(0)).toBe("critical");
    expect(bandFor(39)).toBe("critical");
    expect(bandFor(40)).toBe("developing");
    expect(bandFor(69)).toBe("developing");
    expect(bandFor(70)).toBe("strong");
    expect(bandFor(100)).toBe("strong");
  });
});

describe("dimensionScore", () => {
  it("returns null with no criteria", () => {
    expect(dimensionScore([])).toBeNull();
  });
  it("scales 0-4 ratings to 0-100", () => {
    expect(dimensionScore([{ rating: 4 }, { rating: 4 }])).toBe(100);
    expect(dimensionScore([{ rating: 0 }, { rating: 4 }])).toBe(50);
    expect(dimensionScore([{ rating: 2 }])).toBe(50);
  });
  it("respects weights", () => {
    expect(dimensionScore([{ rating: 4, weight: 3 }, { rating: 0, weight: 1 }])).toBe(75);
  });
  it("clamps out-of-range ratings", () => {
    expect(dimensionScore([{ rating: 9 }])).toBe(100);
    expect(dimensionScore([{ rating: -3 }])).toBe(0);
  });
});

describe("overallScore", () => {
  it("ignores unscored dimensions", () => {
    expect(overallScore([80, null, 40])).toBe(60);
    expect(overallScore([null, null])).toBeNull();
  });
});
