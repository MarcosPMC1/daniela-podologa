import { PriceType } from "@/app/lib/types/service";

export type PriceLike = {
  type: string;
  amount?: number | string | null;
  minAmount?: number | string | null;
  maxAmount?: number | string | null;
  isActive?: boolean;
  employeeId?: string | null;
};

/** Parse a string | number | null to number or NaN */
function toNum(v?: number | string | null): number {
  if (v == null) return NaN;
  return typeof v === "string" ? parseFloat(v) : v;
}

/** Format a single number as BRL currency */
export function fmtBRL(v?: number | string | null): string {
  const n = toNum(v);
  if (isNaN(n)) return "–";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Get the active base price from a prices array */
export function getActivePrice(prices?: PriceLike[]): PriceLike | null {
  if (!prices || prices.length === 0) return null;
  const base = prices.find((p) => !p.employeeId && p.isActive !== false);
  return base ?? prices[0];
}

/**
 * Returns a formatted label for a price object.
 * - FIXED → "R$ 150,00"
 * - RANGE → "R$ 150,00 – R$ 200,00"
 * - null  → null (no price configured)
 */
export function formatPriceLabel(prices?: PriceLike[]): string | null {
  const p = getActivePrice(prices);
  if (!p) return null;

  if (p.type === PriceType.FIXED || p.type === "fixed") {
    const n = toNum(p.amount);
    return isNaN(n) ? null : fmtBRL(n);
  }

  if (p.type === PriceType.RANGE || p.type === "range") {
    const min = toNum(p.minAmount);
    const max = toNum(p.maxAmount);
    if (isNaN(min) && isNaN(max)) return null;
    if (isNaN(min)) return fmtBRL(max);
    if (isNaN(max)) return `A partir de ${fmtBRL(min)}`;
    return `${fmtBRL(min)} – ${fmtBRL(max)}`;
  }

  return null;
}

/** Returns "A partir de" for range or fixed label text */
export function pricePrefix(prices?: PriceLike[]): string {
  const p = getActivePrice(prices);
  if (!p) return "Investimento";
  if (p.type === PriceType.RANGE || p.type === "range") return "A partir de";
  return "Investimento";
}
