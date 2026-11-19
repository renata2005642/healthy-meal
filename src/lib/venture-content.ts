// Hand-written content for the /demo walkthrough and the reusable agent map.

export type AgentKind = "ai" | "rules" | "hand-written" | "human";

export type Agent = {
  name: string;
  // Where the agent lives in the product (a route, or who does the work).
  where: string;
  kind: AgentKind;
  kindLabel: string;
  input: string;
  output: string;
};

export const AGENTS: Agent[] = [
  {
    name: "Meal idea agent",
    where: "/core",
    kind: "ai",
    kindLabel: "Uses Gemini AI",
    input: "Ingredients, time and budget",
    output: "A meal idea, saved to Supabase",
  },
  {
    name: "Kit assistant",
    where: "/chat",
    kind: "rules",
    kindLabel: "Rules only, no AI",
    input: "3 answers: who is cooking, time and craving",
    output: "A kit recommendation, saved to Supabase",
  },
  {
    name: "Marketing content",
    where: "/marketing",
    kind: "hand-written",
    kindLabel: "Hand-written",
    input: "No input",
    output: "Brand, posts and scripts",
  },
  {
    name: "Human checkpoint",
    where: "The founder",
    kind: "human",
    kindLabel: "Human review",
    input: "Flagged chats in Supabase",
    output: "Decisions on what to fix",
  },
];

export type DemoLink = {
  label: string;
  href: string;
  description: string;
};

export type DemoStep = {
  title: string;
  intro: string;
  // Extra paragraphs shown under the intro.
  body?: string[];
  links?: DemoLink[];
  showAgentMap?: boolean;
  // Placeholder steps are filled in a later commit.
  placeholder?: {
    heading: string;
    note: string;
  };
};

export const DEMO_STEPS: DemoStep[] = [
  {
    title: "The problem",
    intro:
      "Students who live alone eat badly because cooking well takes time and they don't know what to cook.",
    body: [
      "After classes, there is little time or energy left to plan a meal, shop for it and cook it.",
      "Without a clear idea of what to make, takeout and junk food become the easy default.",
    ],
  },
  {
    title: "Agent map",
    intro:
      "Healthy Meals is run by four agents. Each one takes something in and gives something back.",
    showAgentMap: true,
  },
  {
    title: "Try it",
    intro: "Use the two agents that talk to students.",
    links: [
      {
        label: "Open the kit assistant",
        href: "/chat",
        description: "Answer 3 questions and get a kit recommendation.",
      },
      {
        label: "Open the meal idea agent",
        href: "/core",
        description: "Enter your ingredients, time and budget to get a meal idea from Gemini.",
      },
    ],
  },
  {
    title: "See the records",
    intro: "Everything the agents save ends up in Supabase. The dashboard shows it, read-only.",
    links: [
      {
        label: "Open the dashboard",
        href: "/dashboard",
        description: "Total counts and the latest saved records for each table.",
      },
    ],
  },
  {
    title: "Evidence",
    intro: "What we tested and what we found.",
    placeholder: {
      heading: "Testing summary",
      note: "This section will be filled in a later update.",
    },
  },
  {
    title: "Impact and next steps",
    intro: "What changed for students, and what comes next.",
    placeholder: {
      heading: "Impact check and Version 2 roadmap",
      note: "This section will be filled in a later update.",
    },
  },
];
