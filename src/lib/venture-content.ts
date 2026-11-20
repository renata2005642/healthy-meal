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

export type HarmCheck = {
  heading: string;
  groups: ImpactGroup[];
};

export type RoadmapItem = {
  goal: string;
  reason: string;
};

export type Roadmap = {
  heading: string;
  // One plain sentence shown above the list.
  intro: string;
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
  harmCheck?: HarmCheck;
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
          comments: "“Very efficient, it got what I needed right.”",
        },
        {
          user: "User 2",
          who: "Student",
          device: "iPhone",
          time: "1 min",
          help: "No",
          rating: "Helpful",
          confused: "Nothing",
          comments: "“I liked that it gives 2 options.”",
        },
        {
          user: "User 3",
          who: "Student",
          device: "iPhone",
          time: "2 min",
          help: "No",
          rating: "Helpful",
          confused: "Nothing",
          comments: "“Very useful, but I would like to see the recipe.”",
        },
        {
          user: "User 4",
          who: "Adult",
          device: "iPhone",
          time: "3 min",
          help: "No",
          rating: "Helpful",
          confused: "The roadmap",
          comments: "“Wait, does it use AI to make the meal idea?”",
        },
        {
          user: "User 5",
          who: "",
          device: "iPhone",
          time: "2 min",
          help: "No",
          rating: "Helpful",
          confused: "The roadmap",
          comments: "“I got a craving for the idea it gave me.”",
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
            "5 outside testers finished the chat without help in 1 to 3 minutes and rated it Helpful.",
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
    harmCheck: {
      heading: "Harm check",
      groups: [
        {
          title: "What we do to reduce harm",
          items: [
            "The chat refuses medical or nutrition questions and tells the person to ask a doctor or nutritionist.",
            "Chats with health questions are flagged for human review.",
            "Typed text is stored only when that guardrail fires (max 200 characters), and the public cannot read it, not even through the dashboard.",
            "The dashboard is read-only and shows no flagged chats.",
            "The kits and the chat show no prices, and ordering is closed, so nobody can be charged.",
          ],
        },
        {
          title: "Risks that remain",
          items: [
            "The AI meal ideas on /core are suggestions, not nutrition advice, and no nutritionist has reviewed them.",
            "Ingredient lists were written by the coding agent and not checked.",
            "The chat does not ask about allergies. It only catches them if the person types them.",
            "There is no login or rate limit, so anyone with the link could add records.",
            "The free database can pause for inactivity.",
          ],
        },
      ],
    },
    roadmap: {
      heading: "Version 2 roadmap",
      intro: "These are the next things we would do if we keep building, in order.",
      items: [
        {
          goal: "Talk to real students to check that our prices feel right.",
          reason: "We have not checked our prices yet, and every money estimate depends on them.",
        },
        {
          goal: "Make the chat pick a different kit depending on who you are cooking for, and add more kits.",
          reason: "Suggestions should fit the people eating, and more kits mean better matches.",
        },
        {
          goal: "Check the ingredient lists and add recipes.",
          reason: "The coding agent wrote the ingredient lists, and no one has checked them yet.",
        },
        {
          goal: "Before real people use it, add accounts with a login and limit how many times one person can use the chat.",
          reason: "Real users need their own protected accounts, and the site needs protection from misuse.",
        },
        {
          goal: "Only start taking real orders after the prices are checked.",
          reason: "Selling at prices we have not checked could mean losing money or charging the wrong amount.",
        },
        {
          goal: "Move to a paid database plan, or keep the free one active so it does not pause.",
          reason: "If the database pauses, the site stops saving and showing records.",
        },
      ],
    },
  },
];
