"use client";

import { useState } from "react";
import { askAIAssistant } from "../../actions/ai-assistant.action";

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
      setAnswer("Something went wrong. Check your OpenAI API key and server logs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">AI Financial Assistant</h1>
          <p className="mt-2 text-slate-600">
            Ask questions about your spending, budgets, savings, and purchases.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <form onSubmit={handleAsk} className="space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Example: Can I afford a ₹50,000 laptop?"
              className="min-h-32 w-full rounded-xl border p-4"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black py-3 font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Thinking..." : "Ask Assistant"}
            </button>
          </form>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {[
            "Can I afford a ₹50,000 laptop?",
            "Why did I overspend this month?",
            "How can I save more money?",
            "Which category is hurting my budget?",
          ].map((sample) => (
            <button
              key={sample}
              onClick={() => setQuestion(sample)}
              className="rounded-xl border bg-white p-4 text-left text-sm hover:bg-slate-100"
            >
              {sample}
            </button>
          ))}
        </div>

        {answer && (
          <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Assistant Answer</h2>
            <div className="mt-4 whitespace-pre-wrap text-slate-700">
              {answer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}