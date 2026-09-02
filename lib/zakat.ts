export const GOLD_NISAB_GRAMS = 87.48;
export const SILVER_NISAB_GRAMS = 612.36;
export const ZAKAT_RATE = 0.025;

export type ZakatInput = {
  cash: number;
  goldGrams: number;
  goldPrice: number;
  silverGrams: number;
  silverPrice: number;
  investments: number;
  business: number;
  receivables: number;
  other: number;
  liabilities: number;
};

export function emptyZakat(): ZakatInput {
  return {
    cash: 0,
    goldGrams: 0,
    goldPrice: 0,
    silverGrams: 0,
    silverPrice: 0,
    investments: 0,
    business: 0,
    receivables: 0,
    other: 0,
    liabilities: 0,
  };
}

export function calculateZakat(input: ZakatInput) {
  const goldValue = input.goldGrams * input.goldPrice;
  const silverValue = input.silverGrams * input.silverPrice;
  const assets =
    input.cash +
    goldValue +
    silverValue +
    input.investments +
    input.business +
    input.receivables +
    input.other;
  const eligible = Math.max(0, assets - input.liabilities);
  const goldNisab = GOLD_NISAB_GRAMS * input.goldPrice;
  const silverNisab = SILVER_NISAB_GRAMS * input.silverPrice;
  const zakat = eligible * ZAKAT_RATE;
  return {
    goldValue,
    silverValue,
    assets,
    eligible,
    goldNisab,
    silverNisab,
    zakat,
  };
}
