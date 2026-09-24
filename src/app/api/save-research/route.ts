import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type SaveResearchRequestBody = {
  query?: string;
  notes?: string;
};

export async function POST(request: Request) {
  let body: SaveResearchRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const query = body.query?.trim();
  const notes = body.notes?.trim();

  if (!query || !notes) {
    return NextResponse.json(
      { error: "query and notes are both required." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("research_outputs")
    .insert({ query_input: query, notes_input: notes })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
