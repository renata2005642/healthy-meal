"use client";

import { useRef, useState, type FormEvent } from "react";
import type { MealKit } from "@/data/meal-kits";
import {
  CATEGORY_OPTIONS,
  COOKING_FOR_OPTIONS,
  MAX_USER_MESSAGE_LENGTH,
  TIME_OPTIONS,
  detectGuardrail,
  pickKits,
  type ChatAnswers,
  type ChatRating,
  type Guardrail,
  type KitPick,
  type SaveChatPayload,
} from "@/lib/chat-logic";

type Message =
  | { id: number; role: "bot" | "user"; text: string }
  | { id: number; role: "bot"; pick: KitPick };

type QuickReply = { label: string; answer: Partial<ChatAnswers> };

type SaveStatus = "idle" | "saving" | "saved" | "error";

const QUESTIONS = {
  cookingFor: "Who are you cooking for?",
  maxMinutes: "How much time do you have?",
  category: "What do you feel like?",
};

// Every guardrail chat is saved with needs_human_review, so every reply says so.
const HUMAN_REVIEW_NOTE = "A person on our team will review this chat.";

const GUARDRAIL_REPLIES: Record<Guardrail, string> = {
  medical: `I can't give medical or nutrition advice. Please ask a doctor or nutritionist. I can still help you pick a kit. ${HUMAN_REVIEW_NOTE}`,
  off_topic: `I can only help you pick a kit. Use the buttons to answer the questions. ${HUMAN_REVIEW_NOTE}`,
};

const INITIAL_MESSAGES: Message[] = [
  { id: 0, role: "bot", text: "Hi! Answer 3 quick questions and I'll suggest a meal kit." },
  { id: 1, role: "bot", text: QUESTIONS.cookingFor },
];

const RATING_OPTIONS: { label: string; rating: ChatRating | null }[] = [
  { label: "👍 Helpful", rating: "up" },
  { label: "👎 Not helpful", rating: "down" },
  { label: "Skip", rating: null },
];

const errorClasses =
  "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400";

function quickRepliesFor(answers: Partial<ChatAnswers>): QuickReply[] {
  if (!answers.cookingFor) {
    return COOKING_FOR_OPTIONS.map((option) => ({ label: option, answer: { cookingFor: option } }));
  }
  if (!answers.maxMinutes) {
    return TIME_OPTIONS.map((option) => ({
      label: option.label,
      answer: { maxMinutes: option.minutes },
    }));
  }
  if (!answers.category) {
    return CATEGORY_OPTIONS.map((category) => ({ label: category, answer: { category } }));
  }
  return [];
}

function buildPayload(
  answers: Partial<ChatAnswers>,
  pick: KitPick | undefined,
  rating: ChatRating | null,
  userMessage: string | null
): SaveChatPayload {
  return {
    intake_people: answers.cookingFor ?? null,
    intake_time: TIME_OPTIONS.find((option) => option.minutes === answers.maxMinutes)?.label ?? null,
    intake_craving: answers.category ?? null,
    recommended_kit: pick?.main.name ?? null,
    rating,
    user_message: userMessage,
  };
}

// Resolves on success; throws with a readable message otherwise.
async function saveChat(payload: SaveChatPayload): Promise<void> {
  let response: Response;
  try {
    response = await fetch("/api/save-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Couldn't reach the server. Check your connection and try again.");
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? "Couldn't save the chat. Please try again.");
  }
}

function KitSummary({ label, kit }: { label: string; kit: MealKit }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black">
      <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
        {label}
      </span>
      <span className="font-semibold text-zinc-900 dark:text-zinc-50">{kit.name}</span>
      <span className="text-sm text-zinc-600 dark:text-zinc-400">Prep time: {kit.prepTime}</span>
    </div>
  );
}

function Recommendation({ pick }: { pick: KitPick }) {
  return (
    <div className="flex flex-col gap-3">
      <p>
        {pick.exactMatch
          ? "Here's my pick for you:"
          : "No kit matched both your time and taste, so here's the closest fit:"}
      </p>
      <KitSummary label="Recommended" kit={pick.main} />
      <KitSummary label="Alternative" kit={pick.alternative} />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Ordering isn&apos;t open yet, so you can&apos;t order these kits for now.
      </p>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [answers, setAnswers] = useState<Partial<ChatAnswers>>({});
  const [draft, setDraft] = useState("");
  const [ratingStatus, setRatingStatus] = useState<SaveStatus>("idle");
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [guardrailSaveError, setGuardrailSaveError] = useState<string | null>(null);
  const nextId = useRef(INITIAL_MESSAGES.length);
  // Refs (not state) so two fast clicks can't both start a save.
  const ratingSaving = useRef(false);
  const guardrailSaved = useRef(false);
  // Bumped on Start over so saves from the previous chat don't update the new one.
  const conversation = useRef(0);

  const pick = messages.find((message) => "pick" in message)?.pick;

  function newId(): number {
    return nextId.current++;
  }

  function handleQuickReply(reply: QuickReply) {
    const nextAnswers = { ...answers, ...reply.answer };
    const userMessage: Message = { id: newId(), role: "user", text: reply.label };

    let botMessage: Message;
    if (!nextAnswers.maxMinutes) {
      botMessage = { id: newId(), role: "bot", text: QUESTIONS.maxMinutes };
    } else if (!nextAnswers.category) {
      botMessage = { id: newId(), role: "bot", text: QUESTIONS.category };
    } else {
      botMessage = { id: newId(), role: "bot", pick: pickKits(nextAnswers as ChatAnswers) };
    }

    setAnswers(nextAnswers);
    setMessages((current) => [...current, userMessage, botMessage]);
  }

  async function saveGuardrailChat(text: string) {
    if (guardrailSaved.current) return;
    guardrailSaved.current = true;
    const chat = conversation.current;
    setGuardrailSaveError(null);

    try {
      await saveChat(buildPayload(answers, pick, null, text));
    } catch (err) {
      if (chat !== conversation.current) return;
      // Let the next guardrail message try again.
      guardrailSaved.current = false;
      setGuardrailSaveError(err instanceof Error ? err.message : "Couldn't save the chat.");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    const guardrail = detectGuardrail(text);
    if (!guardrail) return;

    setMessages((current) => [
      ...current,
      { id: newId(), role: "user", text },
      { id: newId(), role: "bot", text: GUARDRAIL_REPLIES[guardrail] },
    ]);
    setDraft("");
    saveGuardrailChat(text);
  }

  async function handleRating(rating: ChatRating | null) {
    if (ratingSaving.current || ratingStatus === "saved") return;
    ratingSaving.current = true;
    const chat = conversation.current;
    setRatingStatus("saving");
    setRatingError(null);

    try {
      await saveChat(buildPayload(answers, pick, rating, null));
      if (chat === conversation.current) setRatingStatus("saved");
    } catch (err) {
      if (chat !== conversation.current) return;
      setRatingStatus("error");
      setRatingError(err instanceof Error ? err.message : "Couldn't save the chat.");
    } finally {
      if (chat === conversation.current) ratingSaving.current = false;
    }
  }

  function handleStartOver() {
    conversation.current += 1;
    ratingSaving.current = false;
    guardrailSaved.current = false;
    setMessages(INITIAL_MESSAGES);
    setAnswers({});
    setDraft("");
    setRatingStatus("idle");
    setRatingError(null);
    setGuardrailSaveError(null);
  }

  const quickReplies = quickRepliesFor(answers);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Kit assistant
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Answer a few questions and get a meal kit suggestion.
        </p>
      </div>

      <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300">
        Please don&apos;t share personal or health information.
      </p>

      <div className="flex flex-col gap-4 rounded-2xl border border-black/10 p-4 dark:border-white/10 sm:p-6">
        <ul role="log" aria-live="polite" aria-label="Chat messages" className="flex flex-col gap-3">
          {messages.map((message) => (
            <li
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  message.role === "user"
                    ? "rounded-br-sm bg-emerald-700 text-white"
                    : "rounded-bl-sm bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                }`}
              >
                <span className="sr-only">{message.role === "user" ? "You: " : "Assistant: "}</span>
                {"pick" in message ? <Recommendation pick={message.pick} /> : message.text}
              </div>
            </li>
          ))}
        </ul>

        {pick && (
          <div className="flex flex-col gap-3 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
            {ratingStatus === "saved" ? (
              <p role="status" className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                Thanks, your chat was saved.
              </p>
            ) : (
              <>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  Was this helpful?
                </p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Rate this chat">
                  {RATING_OPTIONS.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => handleRating(option.rating)}
                      disabled={ratingStatus === "saving"}
                      className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {ratingStatus === "saving" && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Saving...</p>
                )}
                {ratingError && (
                  <p role="alert" className={errorClasses}>
                    {ratingError}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {quickReplies.length > 0 && (
          <div className="flex flex-wrap justify-end gap-2" role="group" aria-label="Quick replies">
            {quickReplies.map((reply) => (
              <button
                key={reply.label}
                type="button"
                onClick={() => handleQuickReply(reply)}
                className="rounded-full border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
              >
                {reply.label}
              </button>
            ))}
          </div>
        )}

        {guardrailSaveError && (
          <p role="alert" className={errorClasses}>
            {guardrailSaveError}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex gap-2 border-t border-black/10 pt-4 dark:border-white/10"
        >
          <label htmlFor="chat-message" className="sr-only">
            Message
          </label>
          <input
            id="chat-message"
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={MAX_USER_MESSAGE_LENGTH}
            autoComplete="off"
            placeholder="Type a message"
            className="min-w-0 flex-1 rounded-full border border-black/10 bg-transparent px-4 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-700 dark:border-white/10 dark:text-zinc-50"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
        </form>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleStartOver}
          className="rounded-full border border-black/10 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
