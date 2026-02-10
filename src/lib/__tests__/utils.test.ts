import { cn, formatCurrency, formatDate } from "../utils";

describe("cn", () => {
  it("should merge class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("should merge tailwind classes correctly", () => {
    const result = cn("px-4 py-2", "px-6");
    expect(result).toContain("px-6");
    expect(result).toContain("py-2");
    expect(result).not.toContain("px-4");
  });

  it("should handle empty inputs", () => {
    expect(cn()).toBe("");
  });

  it("should handle undefined and null", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end");
  });
});

describe("formatCurrency", () => {
  it("should format value as Brazilian Real", () => {
    const result = formatCurrency(89.9);
    expect(result).toContain("R$");
    expect(result).toContain("89,90");
  });

  it("should format zero", () => {
    const result = formatCurrency(0);
    expect(result).toContain("R$");
    expect(result).toContain("0,00");
  });

  it("should format large values with thousands separator", () => {
    const result = formatCurrency(1299.99);
    expect(result).toContain("1.299,99");
  });

  it("should format negative values", () => {
    const result = formatCurrency(-50);
    expect(result).toContain("50,00");
  });

  it("should handle decimal precision", () => {
    const result = formatCurrency(10.1);
    expect(result).toContain("10,10");
  });
});

describe("formatDate", () => {
  it("should format date in Portuguese", () => {
    const date = new Date(2025, 0, 15); // January 15, 2025
    const result = formatDate(date);
    expect(result).toContain("15");
    expect(result).toContain("2025");
    expect(result).toMatch(/janeiro/i);
  });

  it("should handle different months", () => {
    const date = new Date(2025, 11, 25); // December 25, 2025
    const result = formatDate(date);
    expect(result).toContain("25");
    expect(result).toMatch(/dezembro/i);
  });
});
