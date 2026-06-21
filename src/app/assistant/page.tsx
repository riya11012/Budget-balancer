"use client";

import { useState } from "react";
import { askAIAssistant } from "../../actions/ai-assistant.action";
import ReactMarkdown from "react-markdown";
export default function AssistantPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setAnswer("");

      const response = await askAIAssistant(question);
      setAnswer(response);
    } catch (error) {
      console.error(error);
      setAnswer("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const samples = [
    "Can I afford a ₹50,000 laptop?",
    "Why did I overspend this month?",
    "How can I save more money?",
    "Which category is hurting my budget?",
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-black">
      <div className="mx-auto max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            AI Financial Assistant
          </h1>
          <p className="mt-2 text-slate-600 dark:text-zinc-400">
            Ask questions about your spending, budgets, savings, and purchases.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <form onSubmit={handleAsk} className="space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Example: Can I afford a ₹50,000 laptop?"
              className="min-h-32 w-full rounded-xl border p-4 text-black dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {loading ? "Thinking..." : "Ask Assistant"}
            </button>
          </form>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {samples.map((sample) => (
            <button
              key={sample}
              onClick={() => setQuestion(sample)}
              className="rounded-xl border bg-white p-4 text-left text-sm text-black shadow-sm transition hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900"
            >
              {sample}
            </button>
          ))}
        </div>

        {answer && (
          <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Assistant Answer
            </h2>

            <div className="mt-4 prose max-w-none dark:prose-invert">
  <ReactMarkdown>
    {answer.replace(/\*/g, "")}
  </ReactMarkdown>
</div>
          </div>
        )}
      </div>
    </div>
  );
}