// Pure pricing logic for the Pricing Simulator (no React, no Supabase).
// All amounts are in MXN. Every number here is an assumption, not researched pricing.

export type TierId = "starter" | "standard" | "plus";
export type SegmentId = "solo" | "roommates";
export type ScenarioId = "conservative" | "base" | "optimistic";

export type Tier = {
  id: TierId;
  name: string;
  kitsPerMonth: number;
  priceMxn: number;
};

export type Segment = {
  id: SegmentId;
  name: string;
  description: string;
  priceMultiplier: number;
};

export type Scenario = {
  id: ScenarioId;
  name: string;
  // Whole-number percentages that add up to 100.
  mix: Record<TierId, number>;
};

export type Assumption = {
  label: string;
  value: string;
  note: string;
};

export const TIERS: Tier[] = [
  { id: "starter", name: "Starter", kitsPerMonth: 4, priceMxn: 480 },
  { id: "standard", name: "Standard", kitsPerMonth: 8, priceMxn: 880 },
  { id: "plus", name: "Plus", kitsPerMonth: 12, priceMxn: 1200 },
];

export const SEGMENTS: Segment[] = [
  {
    id: "solo",
    name: "Solo students",
    description: "Students living alone",
    priceMultiplier: 1,
  },
  {
    id: "roommates",
    name: "Roommate households",
    description: "2-3 students sharing a home and cooking together",
    priceMultiplier: 1.7,
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: "conservative",
    name: "Conservative",
    mix: { starter: 70, standard: 25, plus: 5 },
  },
  { id: "base", name: "Base", mix: { starter: 50, standard: 35, plus: 15 } },
  {
    id: "optimistic",
    name: "Optimistic",
    mix: { starter: 30, standard: 40, plus: 30 },
  },
];

export type RevenueInput = {
  soloCustomers: number;
  roommateCustomers: number;
  scenario: ScenarioId;
};

export type RevenueResult = {
  monthlyRevenue: number;
  annualRevenue: number;
  averageSoloPrice: number;
  averageRoommatePrice: number;
};

// Negative, empty, or non-numeric customer counts count as 0.
// Fractional counts are floored, since customers are whole households.
function toCustomerCount(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.floor(n);
}

function getMultiplier(segmentId: SegmentId): number {
  return SEGMENTS.find((s) => s.id === segmentId)?.priceMultiplier ?? 1;
}

export function calculateRevenue(input: RevenueInput): RevenueResult {
  const scenario =
    SCENARIOS.find((s) => s.id === input.scenario) ??
    SCENARIOS.find((s) => s.id === "base")!;

  // Integer math: sum of (percentage × price) is an exact integer
  // ("price × 100"); we only divide at the very end.
  const soloPriceTimes100 = TIERS.reduce(
    (sum, tier) => sum + scenario.mix[tier.id] * tier.priceMxn,
    0
  );

  // Multipliers as integer tenths (1 → 10, 1.7 → 17).
  const soloTenths = Math.round(getMultiplier("solo") * 10);
  const roommateTenths = Math.round(getMultiplier("roommates") * 10);

  const solo = toCustomerCount(input.soloCustomers);
  const roommates = toCustomerCount(input.roommateCustomers);

  // Everything here is in units of MXN × 1000.
  const monthlyTimes1000 =
    solo * soloPriceTimes100 * soloTenths +
    roommates * soloPriceTimes100 * roommateTenths;

  const monthlyRevenue = Math.round(monthlyTimes1000 / 1000);

  return {
    monthlyRevenue,
    annualRevenue: monthlyRevenue * 12,
    averageSoloPrice: (soloPriceTimes100 * soloTenths) / 1000,
    averageRoommatePrice: (soloPriceTimes100 * roommateTenths) / 1000,
  };
}

const ASSUMPTION_NOTE = "Assumption, not researched pricing.";

function formatMix(mix: Record<TierId, number>): string {
  return TIERS.map((t) => `${t.name} ${mix[t.id]}%`).join(" / ");
}

export const ASSUMPTIONS: Assumption[] = [
  ...TIERS.map((tier) => ({
    label: `${tier.name} plan price`,
    value: `$${tier.priceMxn} MXN / month`,
    note: `${tier.kitsPerMonth} kits per month. ${ASSUMPTION_NOTE}`,
  })),
  {
    label: "Roommate price multiplier",
    value: `${getMultiplier("roommates")}×`,
    note: `Kits sized for 3-4 servings. ${ASSUMPTION_NOTE}`,
  },
  ...SCENARIOS.map((scenario) => ({
    label: `${scenario.name} plan mix`,
    value: formatMix(scenario.mix),
    note: `Share of customers on each plan. ${ASSUMPTION_NOTE}`,
  })),
  {
    label: "Annual revenue",
    value: "Monthly × 12",
    note: `No churn modeled. ${ASSUMPTION_NOTE}`,
  },
];
