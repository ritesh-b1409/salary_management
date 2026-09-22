import { describe, expect, it } from "vitest";
import { calculatePercentChange, formatCurrency, formatDate, formatPercentChange } from "./formatters";

describe("formatCurrency", () => {
  it("formats USD with no decimal places", () => {
    expect(formatCurrency(145000, "USD")).toBe("$145,000");
  });

  it("formats other ISO currencies", () => {
    expect(formatCurrency(90000, "GBP")).toBe("£90,000");
  });

  it("falls back gracefully for an unknown currency code", () => {
    expect(formatCurrency(1000, "ZZZ")).toContain("1,000");
  });
});

describe("formatDate", () => {
  it("formats an ISO date string", () => {
    expect(formatDate("2025-01-15")).toBe("Jan 15, 2025");
  });

  it("returns an em dash for missing dates", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate(undefined)).toBe("—");
  });
});

describe("calculatePercentChange", () => {
  it("computes a positive percent change", () => {
    expect(calculatePercentChange(100, 110)).toBeCloseTo(10);
  });

  it("computes a negative percent change", () => {
    expect(calculatePercentChange(200, 150)).toBeCloseTo(-25);
  });

  it("returns 0 when the previous value is 0", () => {
    expect(calculatePercentChange(0, 100)).toBe(0);
  });
});

describe("formatPercentChange", () => {
  it("prefixes positive changes with a plus sign", () => {
    expect(formatPercentChange(100, 115)).toBe("+15.0%");
  });

  it("does not prefix negative changes", () => {
    expect(formatPercentChange(100, 85)).toBe("-15.0%");
  });
});
