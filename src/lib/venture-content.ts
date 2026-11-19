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

export type ImpactGroup = {
  title: string;
  items: string[];
};

export type ImpactCheck = {
  heading: string;
  groups: ImpactGroup[];
};

export type RoadmapItem = {
  goal: string;
  reason: string;
};

export type Roadmap = {
  heading: string;
  // In priority order: the first item comes first.
  items: RoadmapItem[];
};

export type TesterResult = {
  user: string;
  // Left empty when the tester's profile was not recorded.
  who: string;
  device: string;
  time: string;
  help: string;
  rating: string;
  confused: string;
  comments: string;
};

export type Evidence = {
  heading: string;
  testers: TesterResult[];
  testersNote: string;
  summary: string[];
  regression: {
    heading: string;
    items: string[];
  };
  limits: {
    heading: string;
    text: string;
  };
};

export type DemoStep = {
  title: string;
  intro: string;
  // Extra paragraphs shown under the intro.
  body?: string[];
  links?: DemoLink[];
  showAgentMap?: boolean;
  evidence?: Evidence;
  impactCheck?: ImpactCheck;
  roadmap?: Roadmap;
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
    evidence: {
      heading: "Testing summary",
      testers: [
        {
          user: "User 1",
          who: "Student",
          device: "iPhone",
          time: "1 min",
          help: "No",
          rating: "Helpful",
          confused: "Nothing",
          comments: "",
        },
        {
          user: "User 2",
          who: "Student",
          device: "iPhone",
          time: "1 min",
          help: "No",
          rating: "Helpful",
          confused: "Nothing",
          comments: "",
        },
        {
          user: "User 3",
          who: "Student",
          device: "iPhone",
          time: "2 min",
          help: "No",
          rating: "Helpful",
          confused: "Nothing",
          comments: "Asked to see the recipe.",
        },
        {
          user: "User 4",
          who: "Adult",
          device: "iPhone",
          time: "3 min",
          help: "No",
          rating: "Helpful",
          confused: "The roadmap",
          comments: "Was surprised that the meal idea uses AI.",
        },
        {
          user: "User 5",
          who: "",
          device: "iPhone",
          time: "2 min",
          help: "No",
          rating: "Helpful",
          confused: "The roadmap",
          comments: "",
        },
      ],
      testersNote:
        "Users 1 to 3 only tested /chat. Users 4 and 5 did the /demo walkthrough and the chat.",
      summary: [
        "5 of 5 finished without help.",
        "5 of 5 rated the chat Helpful.",
        "Times were between 1 and 3 minutes.",
        "The roadmap was the only confusing part (2 of the 2 people who saw it).",
      ],
      regression: {
        heading: "Full-site regression",
        items: [
          "11 routes tested on the live site: 10 passed on the first run.",
          "/core failed because Gemini timed out intermittently. It was fixed with a retry and English-only output (commit d963278).",
        ],
      },
      limits: {
        heading: "Limits",
        text: "The sample is only 5 people (friends, family and classmates), and none of them are paying customers. It shows the flow is usable, not that people would buy.",
      },
    },
  },
  {
    title: "Impact and next steps",
    intro: "Who this helps, what the evidence says so far, and what comes next.",
    impactCheck: {
      heading: "Impact check",
      groups: [
        {
          title: "Who it helps",
          items: ["Students who live alone or with a roommate and have little time to cook."],
        },
        {
          title: "What the evidence says so far",
          items: [
            "3 outside testers finished the chat in 1 to 2 minutes without help and rated it Helpful.",
            "The chat saves every session and flags health questions for human review.",
          ],
        },
        {
          title: "What is not validated yet",
          items: [
            "Prices are unvalidated.",
            "No real orders exist.",
            "Ingredient lists were written by the coding agent.",
            "The test sample is small.",
            "Nothing proves students would pay.",
          ],
        },
      ],
    },
    roadmap: {
      heading: "Version 2 roadmap",
      items: [
        {
          goal: "Validate prices with real student interviews.",
          reason: "Prices are unvalidated, and every revenue estimate depends on them.",
        },
        {
          goal: "Make \"who are you cooking for\" change which kit is picked, and add more kits.",
          reason: "Recommendations should fit the people cooking, and more kits mean better matches.",
        },
        {
          goal: "Validate the ingredient lists and add recipes.",
          reason: "The ingredient lists were written by the coding agent and have not been checked.",
        },
        {
          goal: "Add login and rate limiting before real use.",
          reason: "Real users need protected accounts, and the app needs protection from abuse.",
        },
        {
          goal: "Open real ordering only after prices are validated.",
          reason: "Taking orders at unvalidated prices risks selling at a loss or at the wrong price.",
        },
        {
          goal: "Move off the free database tier, or keep it alive to avoid pauses.",
          reason: "A paused database would stop saving and showing records.",
        },
      ],
    },
  },
];
