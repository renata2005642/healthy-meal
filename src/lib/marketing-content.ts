// Hardcoded marketing content for /marketing (no React, no Supabase, no AI API).
// Copy is in Mexican Spanish for the target audience. Prep times match src/data/meal-kits.ts.
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
  tagline: "Come mejor. Cocina fácil.",
  voice:
    "Cercana, práctica y sin culpa. Hablamos de tú, como un amigo que ya aprendió a cocinar: sin regaños, sin dietas y sin palabras de nutriólogo.",
  colors: [
    { name: "Verde nopal", hex: "#047857", usage: "Color principal, botones y enlaces" },
    { name: "Maíz", hex: "#F2B632", usage: "Acentos y etiquetas" },
    { name: "Chile", hex: "#C8432B", usage: "Avisos y detalles puntuales" },
    { name: "Crema", hex: "#FFF8EC", usage: "Fondos" },
    { name: "Carbón", hex: "#1C1917", usage: "Texto" },
  ],
  fonts: [
    { role: "Títulos", family: "Geist", cssVariable: "var(--font-geist-sans)" },
    { role: "Texto", family: "Geist", cssVariable: "var(--font-geist-sans)" },
    { role: "Etiquetas y datos", family: "Geist Mono", cssVariable: "var(--font-geist-mono)" },
  ],
};

export const PERSONA: Persona = {
  name: "Dani",
  age: 20,
  city: "Guadalajara, Jalisco",
  situation:
    "Estudia ingeniería, se mudó de su ciudad para ir a la universidad y vive sola en un departamento pequeño. Reparte su dinero entre renta, transporte y comida.",
  goals: [
    "Comer mejor sin dedicarle horas a la cocina",
    "Gastar menos en comida a domicilio",
    "Aprender a cocinar lo básico",
  ],
  painPoints: [
    "No sabe qué cocinar después de un día de clases",
    "Las recetas piden más ingredientes de los que usa una persona",
    "Lo que compra en el súper se echa a perder antes de usarlo",
  ],
  quote: "Quiero comer bien, pero a las nueve de la noche lo más fácil es pedir algo.",
};

export const LANDING_COPY: LandingCopy = {
  headline: "Vives solo, no tienes por qué comer mal",
  subheadline:
    "Healthy Meals te manda kits con los ingredientes porcionados y la receta paso a paso para que cocines algo rico en 10 a 20 minutos, aunque nunca hayas prendido la estufa.",
  benefits: [
    "Ingredientes medidos para ti: compras solo lo que vas a cocinar y desperdicias menos.",
    "Recetas de 10 a 20 minutos que caben entre clases, tareas y trabajo.",
    "Pasos simples, sin técnicas raras ni utensilios que no tienes.",
  ],
  cta: "Quiero mi primer kit",
};

export const SOCIAL_POSTS: Tuple<SocialPost, 10> = [
  {
    channel: "Instagram",
    caption:
      "Salir de casa de tus papás: fácil. Saber qué cenar el martes: otra historia. Healthy Meals llega para resolver la parte de la comida.",
    hashtags: "#VivirSolo #VidaUniversitaria #HealthyMeals",
  },
  {
    channel: "TikTok",
    caption: "POV: abres el refri y solo hay media cebolla y salsa de soya. Esto tiene solución.",
    hashtags: "#EstudianteForaneo #CocinaFacil #HealthyMeals",
  },
  {
    channel: "Instagram",
    caption:
      "Pasta de tomate y albahaca en 10 minutos. Sí, tardas más en elegir qué pedir a domicilio.",
    hashtags: "#RecetasFaciles #ComidaParaUno #HealthyMeals",
  },
  {
    channel: "Facebook",
    caption:
      "¿Eres foráneo y vives solo? Cuéntanos: ¿cuál es la comida que más repites en la semana? Sin juicios, todos hemos estado ahí.",
    hashtags: "#Foraneos #HealthyMeals",
  },
  {
    channel: "Instagram",
    caption:
      "Tres señales de que necesitas un kit: tu sartén sigue nuevo, conoces al repartidor por su nombre y tu cena de ayer fue cereal.",
    hashtags: "#VidaDeEstudiante #HealthyMeals",
  },
  {
    channel: "TikTok",
    caption: "Cocinar para una persona no debería dejarte con medio kilo de jitomate echándose a perder.",
    hashtags: "#ComidaParaUno #TipsDeCocina #HealthyMeals",
  },
  {
    channel: "WhatsApp",
    caption:
      "Si tu amigo foráneo sobrevive a base de sopas instantáneas, mándale esto. Healthy Meals: kits simples para estudiantes que viven solos.",
    hashtags: "#HealthyMeals",
  },
  {
    channel: "Instagram",
    caption:
      "Bowl de pollo con frijoles negros, arroz y un toque de limón, listo en 20 minutos. Comida de verdad en un día de exámenes.",
    hashtags: "#BowlDePollo #SemanaDeExamenes #HealthyMeals",
  },
  {
    channel: "Facebook",
    caption:
      "A los papás de foráneos: sabemos que preguntan si ya comieron. Healthy Meals ayuda a que la respuesta sea sí, y que no haya sido cereal.",
    hashtags: "#EstudiantesForaneos #HealthyMeals",
  },
  {
    channel: "TikTok",
    caption: "No necesitas saber cocinar. Necesitas una receta clara y los ingredientes correctos.",
    hashtags: "#AprendeACocinar #CocinaFacil #HealthyMeals",
  },
];

export const VIDEO_SCRIPTS: Tuple<VideoScript, 3> = [
  {
    title: "La cena del martes",
    hook: "Son las nueve de la noche, acabas de llegar de clases y en tu refri solo hay media cebolla.",
    body: "Abres tu kit de Healthy Meals: los ingredientes ya vienen porcionados y la receta va paso a paso. Pones la pasta, preparas la salsa de tomate y albahaca, y en 10 minutos estás cenando algo hecho por ti.",
    cta: "Deja de improvisar la cena. Pide tu primer kit de Healthy Meals.",
  },
  {
    title: "Cocinar para uno",
    hook: "Nadie te dice esto cuando te mudas solo: el súper está pensado para familias.",
    body: "Compras un manojo de cilantro para una receta y el resto termina en la basura. Con Healthy Meals recibes solo lo que vas a usar en cada comida, medido para que cocines sin que nada se quede olvidado en el refri.",
    cta: "Cocina para uno sin desperdiciar. Conoce Healthy Meals.",
  },
  {
    title: "Mi primera receta",
    hook: "Nunca había prendido la estufa, y hoy preparé esto en 15 minutos.",
    body: "Corta las verduras, calienta el sartén, agrega los fideos y la salsa de soya con jengibre. Eso es todo. Con instrucciones claras e ingredientes listos, cocinar deja de dar miedo y se vuelve parte de tu semana.",
    cta: "Tu primera receta te está esperando. Prueba Healthy Meals.",
  },
];

export const CAMPAIGN_CALENDAR: Tuple<CalendarEntry, 14> = [
  { day: 1, channel: "Instagram", idea: "Post de presentación: qué es Healthy Meals y para quién es." },
  { day: 2, channel: "TikTok", idea: "Publicar el video “La cena del martes”." },
  { day: 3, channel: "Instagram", idea: "Historias con encuesta: ¿qué cenaste anoche?" },
  { day: 4, channel: "Facebook", idea: "Preguntar en grupos de foráneos qué comida repiten más." },
  { day: 5, channel: "TikTok", idea: "Video del POV del refri con media cebolla." },
  { day: 6, channel: "Instagram", idea: "Carrusel de la pasta de tomate y albahaca en 10 minutos." },
  { day: 7, channel: "WhatsApp", idea: "Compartir el mensaje para el amigo foráneo en grupos de la universidad." },
  { day: 8, channel: "TikTok", idea: "Publicar el video “Cocinar para uno”." },
  { day: 9, channel: "Instagram", idea: "Carrusel: tres señales de que necesitas un kit." },
  { day: 10, channel: "Facebook", idea: "Post dirigido a los papás de estudiantes foráneos." },
  { day: 11, channel: "Instagram", idea: "Reel del bowl de pollo para la semana de exámenes." },
  { day: 12, channel: "TikTok", idea: "Publicar el video “Mi primera receta”." },
  { day: 13, channel: "Instagram", idea: "Historias con preguntas y respuestas sobre cómo funcionan los kits." },
  { day: 14, channel: "WhatsApp", idea: "Cierre de campaña: invitación directa a pedir el primer kit." },
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
