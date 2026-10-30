import type { ReactNode } from "react";
import { CopyButton, ExportButton } from "@/components/MarketingActions";
import {
  BRAND,
  CAMPAIGN_CALENDAR,
  EXPORTS,
  LANDING_COPY,
  PERSONA,
  SOCIAL_POSTS,
  VIDEO_SCRIPTS,
  formatBrand,
  formatCalendarEntry,
  formatLandingCopy,
  formatPersona,
  formatSocialPost,
  formatVideoScript,
} from "@/lib/marketing-content";

function Section({
  title,
  description,
  exportText,
  filename,
  children,
}: {
  title: string;
  description?: string;
  exportText: string;
  filename: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
          {description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
          )}
        </div>
        <ExportButton text={exportText} filename={filename} />
      </div>
      {children}
    </section>
  );
}

function Card({
  title,
  copyText,
  children,
}: {
  title: string;
  copyText: string;
  children: ReactNode;
}) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-black/10 p-6 dark:border-white/10">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
        <CopyButton text={copyText} label={title} />
      </div>
      <div lang="es-MX" className="flex flex-col gap-3">
        {children}
      </div>
    </article>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
      {children}
    </span>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <div className="text-sm text-zinc-600 dark:text-zinc-400">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-1 pl-4">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function MarketingPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-16 px-6 py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Marketing
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Brand system, persona, and launch content for Healthy Meals, ready to copy or export.
        </p>
      </div>

      <Section
        title="Brand + Persona"
        description="The persona is illustrative, not validated with interviews."
        exportText={EXPORTS.brandPersona}
        filename="healthy-meals-brand-persona.txt"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <Card title="Brand system" copyText={formatBrand(BRAND)}>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{BRAND.name}</p>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                {BRAND.tagline}
              </p>
            </div>
            <Field label="Voice">{BRAND.voice}</Field>
            <Field label="Colors">
              <ul className="flex flex-col gap-2">
                {BRAND.colors.map((color) => (
                  <li key={color.hex} className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-8 w-8 shrink-0 rounded-lg border border-black/10 dark:border-white/10"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        {color.name}
                      </span>{" "}
                      <span className="font-mono text-xs">{color.hex}</span>
                      <br />
                      {color.usage}
                    </span>
                  </li>
                ))}
              </ul>
            </Field>
            <Field label="Fonts">
              <ul className="flex flex-col gap-1">
                {BRAND.fonts.map((font) => (
                  <li key={font.role} style={{ fontFamily: font.cssVariable }}>
                    {font.role}: {font.family}
                  </li>
                ))}
              </ul>
            </Field>
          </Card>

          <Card title="Target persona" copyText={formatPersona(PERSONA)}>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {PERSONA.name}, {PERSONA.age}
              </p>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                {PERSONA.city}
              </p>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{PERSONA.situation}</p>
            <Field label="Goals">
              <BulletList items={PERSONA.goals} />
            </Field>
            <Field label="Pain points">
              <BulletList items={PERSONA.painPoints} />
            </Field>
            <blockquote className="border-l-2 border-emerald-700 pl-3 text-sm italic text-zinc-900 dark:text-zinc-50">
              “{PERSONA.quote}”
            </blockquote>
          </Card>
        </div>
      </Section>

      <Section
        title="Landing copy"
        exportText={EXPORTS.landing}
        filename="healthy-meals-landing-copy.txt"
      >
        <Card title="Landing page" copyText={formatLandingCopy(LANDING_COPY)}>
          <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {LANDING_COPY.headline}
          </p>
          <p className="text-zinc-600 dark:text-zinc-400">{LANDING_COPY.subheadline}</p>
          <Field label="Benefits">
            <BulletList items={LANDING_COPY.benefits} />
          </Field>
          <Field label="CTA">
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
              {LANDING_COPY.cta}
            </span>
          </Field>
        </Card>
      </Section>

      <Section
        title="Social posts"
        exportText={EXPORTS.posts}
        filename="healthy-meals-social-posts.txt"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {SOCIAL_POSTS.map((post, index) => (
            <Card
              key={post.caption}
              title={`Post ${index + 1} · ${post.channel}`}
              copyText={formatSocialPost(post)}
            >
              <p className="text-sm text-zinc-900 dark:text-zinc-50">{post.caption}</p>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                {post.hashtags}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Video scripts"
        exportText={EXPORTS.scripts}
        filename="healthy-meals-video-scripts.txt"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {VIDEO_SCRIPTS.map((script) => (
            <Card key={script.title} title={script.title} copyText={formatVideoScript(script)}>
              <Field label="Hook">{script.hook}</Field>
              <Field label="Body">{script.body}</Field>
              <Field label="CTA">{script.cta}</Field>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="14-day campaign calendar"
        exportText={EXPORTS.calendar}
        filename="healthy-meals-campaign-calendar.txt"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {CAMPAIGN_CALENDAR.map((entry) => (
            <Card
              key={entry.day}
              title={`Day ${entry.day} · ${entry.channel}`}
              copyText={formatCalendarEntry(entry)}
            >
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{entry.idea}</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
