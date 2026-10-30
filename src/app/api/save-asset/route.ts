import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  ASSET_TYPES,
  MAX_ASSET_CONTENT_LENGTH,
  MAX_ASSET_TITLE_LENGTH,
} from "@/lib/marketing-assets";

function trimmed(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { asset_type, asset_title, asset_content } = (body ?? {}) as Record<string, unknown>;
  const assetTitle = trimmed(asset_title);
  const assetContent = trimmed(asset_content);

  if (!ASSET_TYPES.some((type) => type === asset_type)) {
    return NextResponse.json(
      { error: `asset_type must be one of: ${ASSET_TYPES.join(", ")}.` },
      { status: 400 }
    );
  }

  if (!assetTitle || assetTitle.length > MAX_ASSET_TITLE_LENGTH) {
    return NextResponse.json(
      { error: `asset_title is required (${MAX_ASSET_TITLE_LENGTH} characters max).` },
      { status: 400 }
    );
  }

  if (!assetContent || assetContent.length > MAX_ASSET_CONTENT_LENGTH) {
    return NextResponse.json(
      { error: `asset_content is required (${MAX_ASSET_CONTENT_LENGTH} characters max).` },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("marketing_assets")
    .insert({ asset_type, asset_title: assetTitle, asset_content: assetContent })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
