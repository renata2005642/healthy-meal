import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { SCENARIOS, calculateRevenue, type ScenarioId } from "@/lib/pricing";

type SaveScenarioRequestBody = {
  scenarioName?: string;
  scenarioType?: string;
  soloCustomers?: number;
  roommateCustomers?: number;
  monthlyRevenue?: number;
  annualRevenue?: number;
};

function isValidCount(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

export async function POST(request: Request) {
  let body: SaveScenarioRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const scenarioName = body.scenarioName?.trim();
  const scenarioType = body.scenarioType;

  if (!scenarioName) {
    return NextResponse.json({ error: "Scenario name is required." }, { status: 400 });
  }

  if (!SCENARIOS.some((s) => s.id === scenarioType)) {
    return NextResponse.json(
      { error: "Scenario type must be conservative, base, or optimistic." },
      { status: 400 }
    );
  }

  if (!isValidCount(body.soloCustomers) || !isValidCount(body.roommateCustomers)) {
    return NextResponse.json(
      { error: "Customer counts must be whole numbers of 0 or more." },
      { status: 400 }
    );
  }

  // Recompute on the server so the stored revenue always matches the inputs.
  const revenue = calculateRevenue({
    soloCustomers: body.soloCustomers,
    roommateCustomers: body.roommateCustomers,
    scenario: scenarioType as ScenarioId,
  });

  const { data, error } = await supabase
    .from("pricing_scenarios")
    .insert({
      scenario_name: scenarioName,
      scenario_type: scenarioType,
      solo_customers: body.soloCustomers,
      roommate_customers: body.roommateCustomers,
      monthly_revenue: revenue.monthlyRevenue,
      annual_revenue: revenue.annualRevenue,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
