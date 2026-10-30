// Hardcoded marketing content for /marketing (no React, no Supabase, no AI API).
// Copy is in English for college students living away from home in Mexico. Prep times match src/data/meal-kits.ts.
// It leaves out prices and discounts on purpose: plan pricing is still an assumption.

// Fixed-length array, so tsc fails if a list has the wrong number of items.
type Tuple<T, N extends number, R extends T[] = []> = R["length"] extends N
  ? R
  : Tuple<T, N, [T, ...R]>;

export type Channel = "Instagram" | "TikTok" | "WhatsApp" | "Facebook";

export type BrandColor = {
  name: string;
  hex: string;
  usage: string;
};

export type BrandFont = {
  role: string;
  family: string;
  cssVariable: string;
};

export type Brand = {
  name: string;
  tagline: string;
  voice: string;
  colors: Tuple<BrandColor, 5>;
  fonts: BrandFont[];
};

export type Persona = {
  name: string;
  age: number;
  city: string;
  situation: string;
  goals: string[];
  painPoints: string[];
  quote: string;
};

export type LandingCopy = {
  headline: string;
  subheadline: string;
  benefits: Tuple<string, 3>;
  cta: string;
};

export type SocialPost = {
  channel: Channel;
  caption: string;
  hashtags: string;
};

export type VideoScript = {
  title: string;
  hook: string;
  body: string;
  cta: string;
};

export type CalendarEntry = {
  day: number;
  channel: Channel;
  idea: string;
};

export const BRAND: Brand = {
  name: "Healthy Meals",
  tagline: "Eat better. Cook easier.",
  voice:
    "Friendly, practical, and guilt-free. We talk like a friend who already figured out how to cook: no lectures, no diets, and no nutritionist jargon.",
  colors: [
    { name: "Nopal green", hex: "#047857", usage: "Primary color, buttons, and links" },
    { name: "Corn", hex: "#F2B632", usage: "Accents and tags" },
    { name: "Chile", hex: "#C8432B", usage: "Alerts and small details" },
    { name: "Cream", hex: "#FFF8EC", usage: "Backgrounds" },
    { name: "Charcoal", hex: "#1C1917", usage: "Text" },
  ],
  fonts: [
    { role: "Headings", family: "Geist", cssVariable: "var(--font-geist-sans)" },
    { role: "Body", family: "Geist", cssVariable: "var(--font-geist-sans)" },
    { role: "Labels and data", family: "Geist Mono", cssVariable: "var(--font-geist-mono)" },
  ],
};

export const PERSONA: Persona = {
  name: "Dani",
  age: 20,
  city: "Guadalajara, Jalisco",
  situation:
    "Engineering student who moved to a new city for college and lives alone in a small apartment. Every peso gets split between rent, transportation, and food.",
  goals: [
    "Eat better without spending hours in the kitchen",
    "Spend less on food delivery",
    "Learn the cooking basics",
  ],
  painPoints: [
    "Has no idea what to cook after a full day of classes",
    "Recipes call for way more ingredients than one person needs",
    "Groceries go bad before they get used",
  ],
  quote: "I want to eat well, but at 9 p.m. it's just easier to order something.",
};

export const LANDING_COPY: LandingCopy = {
  headline: "Living alone doesn't have to mean eating badly",
  subheadline:
    "Healthy Meals sends you kits with pre-portioned ingredients and step-by-step recipes, so you can cook something great in 10 to 20 minutes, even if you've never turned on the stove.",
  benefits: [
    "Ingredients measured for you: you only get what you'll actually cook, so less goes to waste.",
    "Recipes that take 10 to 20 minutes and fit between classes, homework, and work.",
    "Simple steps, with no fancy techniques or tools you don't own.",
  ],
  cta: "Order your first kit",
};

export const SOCIAL_POSTS: Tuple<SocialPost, 10> = [
  {
    channel: "Instagram",
    caption:
      "Moving out of your parents' place: easy. Figuring out what's for dinner on a Tuesday: a whole other story. Healthy Meals is here for the food part.",
    hashtags: "#LivingAlone #CollegeLife #HealthyMeals",
  },
  {
    channel: "TikTok",
    caption: "POV: you open the fridge and all that's in there is half an onion and some soy sauce. We can fix this.",
    hashtags: "#StudentLife #EasyCooking #HealthyMeals",
  },
  {
    channel: "Instagram",
    caption:
      "Tomato basil pasta in 10 minutes. Yes, that's less time than it takes you to pick something on a delivery app.",
    hashtags: "#EasyRecipes #CookingForOne #HealthyMeals",
  },
  {
    channel: "Facebook",
    caption:
      "Out-of-town student living alone? Tell us: what's the meal you eat most often during the week? No judgment, we've all been there.",
    hashtags: "#OutOfTownStudents #HealthyMeals",
  },
  {
    channel: "Instagram",
    caption:
      "Three signs you need a kit: your pan still looks brand new, you know your delivery driver by name, and last night's dinner was cereal.",
    hashtags: "#StudentLife #HealthyMeals",
  },
  {
    channel: "TikTok",
    caption: "Cooking for one shouldn't leave you with a pile of tomatoes going bad on the counter.",
    hashtags: "#CookingForOne #CookingTips #HealthyMeals",
  },
  {
    channel: "WhatsApp",
    caption:
      "If your out-of-town friend is surviving on instant noodles, send them this. Healthy Meals: simple kits for students living on their own.",
    hashtags: "#HealthyMeals",
  },
  {
    channel: "Instagram",
    caption:
      "Chicken bowl with black beans, rice, and a squeeze of lime, ready in 20 minutes. Real food, even during exam week.",
    hashtags: "#ChickenBowl #ExamWeek #HealthyMeals",
  },
  {
    channel: "Facebook",
    caption:
      "To the parents of students living away from home: we know you keep asking if they've eaten. Healthy Meals helps the answer be yes, and not just cereal.",
    hashtags: "#OutOfTownStudents #HealthyMeals",
  },
  {
    channel: "TikTok",
    caption: "You don't need to know how to cook. You just need a clear recipe and the right ingredients.",
    hashtags: "#LearnToCook #EasyCooking #HealthyMeals",
  },
];

export const VIDEO_SCRIPTS: Tuple<VideoScript, 3> = [
  {
    title: "Tuesday night dinner",
    hook: "It's 9 p.m., you just got back from class, and all that's in your fridge is half an onion.",
    body: "You open your Healthy Meals kit: the ingredients are already portioned and the recipe walks you through every step. You boil the pasta, make the tomato basil sauce, and 10 minutes later you're eating something you made yourself.",
    cta: "Stop improvising dinner. Order your first Healthy Meals kit.",
  },
  {
    title: "Cooking for one",
    hook: "Nobody tells you this when you move out: grocery stores are built for families.",
    body: "You buy a whole bunch of cilantro for one recipe and the rest ends up in the trash. With Healthy Meals you only get what you'll use for each meal, measured out so nothing gets forgotten in the back of the fridge.",
    cta: "Cook for one without the waste. Check out Healthy Meals.",
  },
  {
    title: "My first recipe",
    hook: "I had never turned on a stove, and today I made this in 15 minutes.",
    body: "Chop the veggies, heat up the pan, add the noodles and the soy-ginger sauce. That's it. With clear instructions and the ingredients ready to go, cooking stops being scary and becomes part of your week.",
    cta: "Your first recipe is waiting. Try Healthy Meals.",
  },
];

export const CAMPAIGN_CALENDAR: Tuple<CalendarEntry, 14> = [
  { day: 1, channel: "Instagram", idea: "Intro post: what Healthy Meals is and who it's for." },
  { day: 2, channel: "TikTok", idea: "Post the “Tuesday night dinner” video." },
  { day: 3, channel: "Instagram", idea: "Stories poll: what did you have for dinner last night?" },
  { day: 4, channel: "Facebook", idea: "Ask out-of-town student groups which meal they repeat the most." },
  { day: 5, channel: "TikTok", idea: "POV video of the fridge with half an onion." },
  { day: 6, channel: "Instagram", idea: "Carousel: tomato basil pasta in 10 minutes." },
  { day: 7, channel: "WhatsApp", idea: "Share the out-of-town friend message in college group chats." },
  { day: 8, channel: "TikTok", idea: "Post the “Cooking for one” video." },
  { day: 9, channel: "Instagram", idea: "Carousel: three signs you need a kit." },
  { day: 10, channel: "Facebook", idea: "Post aimed at parents of students living away from home." },
  { day: 11, channel: "Instagram", idea: "Reel: chicken bowl for exam week." },
  { day: 12, channel: "TikTok", idea: "Post the “My first recipe” video." },
  { day: 13, channel: "Instagram", idea: "Stories Q&A about how the kits work." },
  { day: 14, channel: "WhatsApp", idea: "Campaign wrap-up: direct invite to order a first kit." },
];

function bulletList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function joinCards(cards: string[]): string {
  return cards.join("\n\n");
}

export function formatBrand(brand: Brand): string {
  return [
    brand.name,
    `Tagline: ${brand.tagline}`,
    `Voice: ${brand.voice}`,
    `Colors:\n${bulletList(brand.colors.map((c) => `${c.name} ${c.hex}: ${c.usage}`))}`,
    `Fonts:\n${bulletList(brand.fonts.map((f) => `${f.role}: ${f.family}`))}`,
  ].join("\n");
}

export function formatPersona(persona: Persona): string {
  return [
    `Persona: ${persona.name}, ${persona.age}, ${persona.city}`,
    persona.situation,
    `Goals:\n${bulletList(persona.goals)}`,
    `Pain points:\n${bulletList(persona.painPoints)}`,
    `Quote: “${persona.quote}”`,
  ].join("\n");
}

export function formatLandingCopy(copy: LandingCopy): string {
  return [
    `Headline: ${copy.headline}`,
    `Subheadline: ${copy.subheadline}`,
    `Benefits:\n${bulletList(copy.benefits)}`,
    `CTA: ${copy.cta}`,
  ].join("\n");
}

export function formatSocialPost(post: SocialPost): string {
  return `${post.caption}\n\n${post.hashtags}`;
}

export function formatVideoScript(script: VideoScript): string {
  return [
    script.title,
    `Hook: ${script.hook}`,
    `Body: ${script.body}`,
    `CTA: ${script.cta}`,
  ].join("\n");
}

export function formatCalendarEntry(entry: CalendarEntry): string {
  return `Day ${entry.day} (${entry.channel}): ${entry.idea}`;
}

export const EXPORTS = {
  brandPersona: joinCards([formatBrand(BRAND), formatPersona(PERSONA)]),
  landing: formatLandingCopy(LANDING_COPY),
  posts: joinCards(
    SOCIAL_POSTS.map(
      (post, index) => `Post ${index + 1} (${post.channel})\n${formatSocialPost(post)}`
    )
  ),
  scripts: joinCards(VIDEO_SCRIPTS.map(formatVideoScript)),
  calendar: CAMPAIGN_CALENDAR.map(formatCalendarEntry).join("\n"),
};
