"use server";

import { auth } from "../auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAIContext   } from "../repositories/ai-context.repository";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function askAIAssistant(
  question: string
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const context = await getAIContext(
    session.user.id
  );

  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
  });

  const prompt = `
You are Budget Balancer's friendly AI Financial Assistant.

User Question:
${question}

Financial Context:
${JSON.stringify(context, null, 2)}

Rules:
- Keep answers under 100 words.
- Be supportive and conversational.
- Never start with "No, you cannot afford this."
- Instead explain the situation politely.
- Start with one short summary sentence.
- Give at most 3 reasons.
- Give at most 2 actionable suggestions.

Format:

Summary:
...

Why:
• ...
• ...

Suggestion:
• ...
• ...
`;

  const result =
    await model.generateContent(prompt);

  return result.response.text();
}