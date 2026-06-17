"use client";

import Link from "next/link";
import { Bot } from "lucide-react";

export function AIAssistantButton() {
  return (
    <Link
      href="/assistant"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition hover:scale-105 hover:bg-slate-800"
      aria-label="Open AI Assistant"
      title="AI Assistant"
    >
      <Bot className="h-7 w-7" />
    </Link>
  );
}