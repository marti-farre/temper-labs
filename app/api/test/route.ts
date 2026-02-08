import { NextRequest } from "next/server";
import { attacks } from "@/lib/attacks";
import { createClient, chat } from "@/lib/openai";
import { judge } from "@/lib/judge";
import { incrementStats } from "@/lib/stats";

const rateLimitMap = new Map<string, number[]>();

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const timestamps =
    rateLimitMap.get(ip)?.filter((t) => now - t < 60_000) ?? [];

  if (timestamps.length >= 10) {
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded. Max 10 tests per minute.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);

  let body: { apiKey?: string; systemPrompt?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { apiKey, systemPrompt } = body;

  if (!apiKey || !systemPrompt) {
    return new Response(
      JSON.stringify({ error: "apiKey and systemPrompt are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const client = createClient(apiKey);
      let score = 0;

      for (let i = 0; i < attacks.length; i++) {
        const attack = attacks[i];
        try {
          const response = await chat(
            client,
            "gpt-4o",
            systemPrompt,
            attack.prompt
          );
          const result = await judge(
            client,
            systemPrompt,
            attack.prompt,
            response
          );
          if (result.passed) score++;

          const line = JSON.stringify({
            index: i,
            id: attack.id,
            name: attack.name,
            category: attack.category,
            description: attack.description,
            passed: result.passed,
            reason: result.reason,
            response: response,
          });
          controller.enqueue(encoder.encode(line + "\n"));
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Unknown error";
          const line = JSON.stringify({
            index: i,
            id: attack.id,
            name: attack.name,
            category: attack.category,
            description: attack.description,
            passed: false,
            reason: `Error: ${message}`,
            response: "",
            error: true,
          });
          controller.enqueue(encoder.encode(line + "\n"));
        }
      }

      const summary = JSON.stringify({
        done: true,
        score,
        total: attacks.length,
      });
      controller.enqueue(encoder.encode(summary + "\n"));
      controller.close();

      await incrementStats().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
