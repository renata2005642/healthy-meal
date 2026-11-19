// Hand-written content for /docs: the Prompt Library and the weekly Build Logs.
import { MEAL_PROMPT_TEMPLATE } from "./prompts";

// "exact" = the prompt text as it exists in the repo; "summary" = a short,
// accurate description of a prompt whose original text is not in the repo.
export type PromptKind = "exact" | "summary";

export type PromptEntry = {
  title: string;
  whatItDid: string;
  kind: PromptKind;
  // Where the exact text lives in the repo (only for "exact" prompts).
  source?: string;
  prompt: string;
};

export type Commit = {
  hash: string;
  message: string;
};

export type WeekPrompts = {
  week: number;
  page: string;
  prompts: PromptEntry[];
};

export type BuildLog = {
  week: number;
  page: string;
  dates: string;
  built: string;
  tested: string[];
  commits: Commit[];
};

const NOT_RECORDED = "No test notes were recorded in the commit history for this week.";

export const PROMPT_LIBRARY: WeekPrompts[] = [
  {
    week: 1,
    page: "/core",
    prompts: [
      {
        title: "Gemini meal-idea prompt",
        whatItDid:
          "The prompt /api/generate-meal sends to Gemini. {ingredients}, {timeLabel} and {budgetLabel} are filled in from the /core form, and Gemini answers with JSON: name, ingredients used, estimated time and description.",
        kind: "exact",
        source: "src/lib/prompts.ts (MEAL_PROMPT_TEMPLATE)",
        prompt: MEAL_PROMPT_TEMPLATE,
      },
      {
        title: "Build the Generative Core Agent",
        whatItDid:
          "Created the /core intake form and the /api/generate-meal route that calls Gemini on the server, with Save to core_outputs and a Recently saved list.",
        kind: "summary",
        prompt:
          "Add an intake form on /core (ingredients, time, budget) that calls a new /api/generate-meal route. The route calls the Gemini API on the server using GEMINI_API_KEY and returns one structured meal idea (name, ingredients used, estimated time, description) shown as a result card. Add a Save button that writes to the Supabase core_outputs table and show the last 5 saved outputs. Also show the exact Gemini prompt on /docs.",
      },
    ],
  },
  {
    week: 2,
    page: "/research",
    prompts: [
      {
        title: "Build the research page",
        whatItDid:
          "Turned the /research placeholder into a research hub with an intake form saved through /api/save-research, plus market research content.",
        kind: "summary",
        prompt:
          "Build /research with an intake form (query + notes) that posts to a new /api/save-research route, which validates the input and inserts into research_outputs. Show the latest 5 saved rows, 5 global meal-kit examples, a Mexico localization summary, a searchable table of 8 Mexican competitors and substitutes, and a risk map with 3 meters. Add a latest-research widget to /dashboard, then translate /core, /research and /dashboard to English.",
      },
    ],
  },
  {
    week: 3,
    page: "/pricing",
    prompts: [
      {
        title: "Build the pricing simulator",
        whatItDid:
          "Added the pricing logic, a /product page and a /pricing revenue simulator that can save scenarios to Supabase.",
        kind: "summary",
        prompt:
          "Add pricing logic (tiers, segments, scenarios and a calculateRevenue function). Build /product with a feature map and plan comparison. Build /pricing as a revenue simulator with a conservative / base / optimistic scenario toggle, save scenarios to the pricing_scenarios table through /api/save-scenario, show saved scenarios on the page, and validate that customer counts are whole numbers of 0 or more.",
      },
    ],
  },
  {
    week: 4,
    page: "/marketing",
    prompts: [
      {
        title: "Build the marketing content hub",
        whatItDid:
          "Created /marketing with copy and .txt export, an A/B tester, a /kits page and saving of marketing assets to Supabase.",
        kind: "summary",
        prompt:
          "Build /marketing as a content hub with copyable marketing copy and .txt export, in English. Add an A/B tester, upgrade the homepage and replace the broken /catalog links with a new /kits page. Save marketing assets to the marketing_assets table through /api/save-asset, and add brand and persona asset types.",
      },
    ],
  },
  {
    week: 5,
    page: "/chat",
    prompts: [
      {
        title: "Build the rule-based kit assistant",
        whatItDid:
          "Created a guided /chat assistant that picks a meal kit from quick-reply answers, without AI, and saves rated sessions.",
        kind: "summary",
        prompt:
          "Build a rule-based kit assistant on /chat (no AI) that asks who is cooking, how much time they have and what they crave, then recommends a kit. Save and rate each session in chat_sessions through /api/save-chat; the server recomputes the guardrail and only stores typed text for chats that hit it.",
      },
      {
        title: "Guardrails and people-aware results",
        whatItDid:
          "Added a server-built summary, pregnancy-term detection with a human review note, and results scaled to the number of people cooking.",
        kind: "summary",
        prompt:
          "Save a server-built summary with each chat session. Treat pregnancy and breastfeeding terms as medical, reply that we can't give medical advice and that a person on our team will review the chat. Adapt the result to the number of people cooking and show the kit ingredients scaled for 2 people.",
      },
    ],
  },
  {
    week: 6,
    page: "/dashboard",
    prompts: [
      {
        title: "Fix /core hanging on Generating...",
        whatItDid:
          "Diagnosed why /core hung in production and added a 20-second timeout with a clear error message in the UI.",
        kind: "summary",
        prompt:
          "On production, /core \"Generate meal idea\" hangs forever on \"Generating...\". Diagnose and fix it: check the Gemini model name, the env var name used vs .env.example and the error handling, add a 20-second request timeout and show a clear error in the UI instead of hanging. Never print or expose keys. Run tsc, lint and build, then commit and push to main.",
      },
      {
        title: "Build the read-only dashboard",
        whatItDid:
          "Replaced the /dashboard placeholder with one card per Supabase table, showing the total count and the latest 5 rows.",
        kind: "summary",
        prompt:
          "Build a read-only /dashboard using the existing Supabase client. For core_outputs, research_outputs, pricing_scenarios, marketing_assets and chat_sessions, show a card with the total count and the latest 5 rows. For chat_sessions select only id, created_at, intake_people, intake_time, intake_craving, recommended_kit, rating and summary (never user_message or needs_human_review). If a table can't be read, show \"Not available\" in that card.",
      },
    ],
  },
];

export const BUILD_LOGS: BuildLog[] = [
  {
    week: 1,
    page: "/core",
    dates: "Sep 3 – Sep 10, 2026",
    built:
      "Generative Core Agent: an intake form (ingredients, time, budget) that asks Gemini for one meal idea, with Save to core_outputs and a Recently saved list.",
    tested: [
      "Manual Gemini tests: gemini-3.8-flash kept returning 503 \"high demand\" (1 of 8 calls succeeded), while gemini-3.6-flash succeeded in 7 of 8, so the route was switched to it.",
    ],
    commits: [
      { hash: "deeda30", message: "feat: add Generative Core Agent intake form and Gemini meal generation API" },
      { hash: "51f9df3", message: "docs: add Prompt Library section showing the Gemini meal-generation prompt" },
      { hash: "ca80e5a", message: "Revert the Prompt Library commit" },
      { hash: "2c8a257", message: "Revert the first Generative Core Agent commit" },
      { hash: "aedb545", message: "feat: add Generative Core Agent intake form and Gemini meal generation API" },
      { hash: "0e95a07", message: "fix: switch generate-meal API to gemini-3.6-flash for stability" },
    ],
  },
  {
    week: 2,
    page: "/research",
    dates: "Sep 24, 2026",
    built:
      "Research hub: an intake form saved to research_outputs, global and Mexican competitor research, a risk map, and a latest-research widget on /dashboard.",
    tested: [NOT_RECORDED],
    commits: [
      { hash: "d44aa8e", message: "feat: add ResearchOutputRow type for research_outputs table" },
      { hash: "07e0a26", message: "feat: add /api/save-research endpoint" },
      { hash: "125ce17", message: "feat: build /research page" },
      { hash: "4785a36", message: "feat: add latest-research widget to /dashboard" },
      { hash: "e49cbd1", message: "i18n: translate /core, /research, and /dashboard UI text to English" },
    ],
  },
  {
    week: 3,
    page: "/pricing",
    dates: "Oct 7 – Oct 8, 2026",
    built:
      "Pricing simulator: tiers, segments and scenarios, a revenue calculator, saved scenarios in pricing_scenarios, and a /product page.",
    tested: [NOT_RECORDED],
    commits: [
      { hash: "cb6ff58", message: "feat: add pricing logic (tiers, segments, scenarios, calculateRevenue)" },
      { hash: "15c24e5", message: "feat: add /product page with feature map and plan comparison" },
      { hash: "fdb9d19", message: "feat: add /pricing simulator with revenue calculator and scenario toggle" },
      { hash: "78de63b", message: "feat: save pricing scenarios to Supabase" },
      { hash: "b669956", message: "feat: show saved pricing scenarios on /pricing" },
      { hash: "27e69a1", message: "fix: validate customer counts on /pricing" },
    ],
  },
  {
    week: 4,
    page: "/marketing",
    dates: "Oct 30, 2026",
    built:
      "Marketing content hub: copy with .txt export, an A/B tester, a /kits page, and saved assets in marketing_assets.",
    tested: [NOT_RECORDED],
    commits: [
      { hash: "34efb0d", message: "feat: add /marketing content hub with copy and .txt export" },
      { hash: "dfc995f", message: "feat: translate /marketing content to English" },
      { hash: "684507a", message: "feat: add A/B tester to /marketing, upgrade homepage, add /kits" },
      { hash: "f85273a", message: "feat: save marketing assets to Supabase from /marketing" },
      { hash: "31e0d94", message: "feat: add brand and persona asset types" },
    ],
  },
  {
    week: 5,
    page: "/chat",
    dates: "Nov 3 – Nov 6, 2026",
    built:
      "Rule-based kit assistant: quick-reply intake, a kit recommendation, ratings and guardrails, with sessions saved in chat_sessions.",
    tested: [NOT_RECORDED],
    commits: [
      { hash: "0070efa", message: "feat: add rule-based kit assistant on /chat" },
      { hash: "60638f2", message: "feat: save and rate /chat sessions in Supabase" },
      { hash: "cc7a15d", message: "feat: save a server-built summary with each chat session" },
      { hash: "a593b42", message: "feat: catch pregnancy terms and show human review note on /chat" },
      { hash: "6cec7fe", message: "feat: adapt /chat result to the number of people cooking" },
      { hash: "8ba41c4", message: "feat: show kit ingredients on /chat, scaled for 2 people" },
    ],
  },
  {
    week: 6,
    page: "/dashboard",
    dates: "Nov 18, 2026",
    built:
      "Read-only dashboard with a card per Supabase table (total count + latest 5 rows), plus a fix for /core hanging in production.",
    tested: [
      "/core fix: tsc, lint and build passed; the built app returned a meal from /api/generate-meal in about 6 seconds.",
      "/dashboard: tsc, lint and build passed; all 5 table queries ran against Supabase, and chat_sessions returned only the 8 allowed columns.",
    ],
    commits: [
      { hash: "914ffe5", message: "fix: stop /core meal generation from hanging (20s Gemini timeout + clear UI error)" },
      { hash: "8ae3376", message: "feat: read-only /dashboard of saved Supabase records" },
    ],
  },
];
