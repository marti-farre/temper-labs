import { NextRequest, NextResponse } from "next/server";
import { attacks } from "@/lib/attacks";
import { chatWithProvider, ProviderName, isValidModel } from "@/lib/providers";
import { judge } from "@/lib/judge";
import { incrementStats } from "@/lib/stats";

// In-memory rate limiting
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW);
  rateLimitMap.set(ip, recent);
  if (recent.length >= RATE_LIMIT) return true;
  recent.push(now);
  return false;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  let body: {
    provider: ProviderName;
    model: string;
    apiKey: string;
    systemPrompt: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { provider, model, apiKey, systemPrompt } = body;

  if (!provider || !model || !apiKey || !systemPrompt) {
    return NextResponse.json(
      { error: "Missing required fields: provider, model, apiKey, systemPrompt" },
      { status: 400 }
    );
  }

  if (!["openai", "anthropic", "mistral"].includes(provider)) {
    return NextResponse.json(
      { error: "Invalid provider" },
      { status: 400 }
    );
  }

  if (!isValidModel(provider, model)) {
    return NextResponse.json(
      { error: "Invalid model for the selected provider" },
      { status: 400 }
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let score = 0;

      for (let i = 0; i < attacks.length; i++) {
        const attack = attacks[i];

        try {
          // Run the attack
          const response = await chatWithProvider(
            provider,
            model,
            apiKey,
            systemPrompt,
            attack.prompt
          );

          // Judge the response
          const verdict = await judge(
            provider,
            model,
            apiKey,
            systemPrompt,
            attack.prompt,
            response
          );

          if (verdict.verdict === "BLOCKED") score++;

          const result = {
            index: i,
            id: attack.id,
            name: attack.name,
            category: attack.category,
            description: attack.description,
            verdict: verdict.verdict,
            reason: verdict.reason,
            response,
          };

          controller.enqueue(encoder.encode(JSON.stringify(result) + "\n"));
        } catch (err) {
          const errorResult = {
            index: i,
            id: attack.id,
            name: attack.name,
            category: attack.category,
            description: attack.description,
            verdict: "FAILED" as const,
            reason:
              err instanceof Error
                ? err.message
                : "Error running attack",
            response: "",
            error: true,
          };

          controller.enqueue(
            encoder.encode(JSON.stringify(errorResult) + "\n")
          );
        }
      }

      // Send completion signal
      controller.enqueue(
        encoder.encode(
          JSON.stringify({ done: true, score, total: attacks.length }) + "\n"
        )
      );

      // Increment global counter
      try {
        incrementStats();
      } catch {
        // Non-critical
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
