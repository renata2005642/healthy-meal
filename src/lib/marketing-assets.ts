// Shared types and limits for the marketing_assets table.

export const ASSET_TYPES = ["landing", "post", "script", "calendar", "headline"] as const;

export type AssetType = (typeof ASSET_TYPES)[number];

export const MAX_ASSET_TITLE_LENGTH = 200;
export const MAX_ASSET_CONTENT_LENGTH = 10000;

export type MarketingAssetRow = {
  id: string;
  created_at: string;
  asset_type: AssetType;
  asset_title: string;
  asset_content: string;
};
