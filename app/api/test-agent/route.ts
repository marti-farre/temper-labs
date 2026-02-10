import { NextRequest, NextResponse } from "next/server";
import {
  AgentCapability,
  AGENT_CAPABILITIES,
  getAttacksForCapabilities,
} from "@/lib/agent-attacks";
import { chatWithProvider, chatFree, ProviderName, isValidModel } from "@/lib/providers";
import { judgeAgent, judgeAgentFree } from "@/lib/agent-judge";
import { saveAgentTest } from "@/lib/stats";

// In-memory rate limiting
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW);
  rateLimitMap.set(ip, recent);
  if (recent.length >= RATE_LIMIT) return true;
  recent.push(now);
  return false;
}

const VALID_CAPABILITIES = new Set(
  AGENT_CAPABILITIES.map((c) => c.id)
);

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  let body: {
    mode?: "free" | "byok";
    provider?: ProviderName;
    model?: string;
    apiKey?: string;
    capabilities: AgentCapability[];
    systemPrompt?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { mode = "byok", provider, model, apiKey, capabilities, systemPrompt } = body;

  if (!capabilities || capabilities.length === 0) {
    return NextResponse.json(
      { error: "Missing required field: capabilities" },
      { status: 400 }
    );
  }

  if (mode === "byok") {
    if (!provider || !model || !apiKey) {
      return NextResponse.json(
        { error: "Missing required fields: provider, model, apiKey" },
        { status: 400 }
      );
    }

    if (!["openai", "anthropic", "mistral"].includes(provider)) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    if (!isValidModel(provider, model)) {
      return NextResponse.json(
        { error: "Invalid model for the selected provider" },
        { status: 400 }
      );
    }
  }

  const validCapabilities = capabilities.filter((c) =>
    VALID_CAPABILITIES.has(c)
  );
  if (validCapabilities.length === 0) {
    return NextResponse.json(
      { error: "No valid capabilities selected" },
      { status: 400 }
    );
  }

  const attacks = getAttacksForCapabilities(validCapabilities);
  if (attacks.length === 0) {
    return NextResponse.json(
      { error: "No attacks available for selected capabilities" },
      { status: 400 }
    );
  }

  const agentSystemPrompt =
    systemPrompt ||
    `You are a helpful AI assistant with the following capabilities: ${validCapabilities.join(", ")}.`;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let score = 0;
      let warnings = 0;
      const failedIds: number[] = [];

      const isFree = mode === "free";

      for (let i = 0; i < attacks.length; i++) {
        const attack = attacks[i];

        try {
          const response = isFree
            ? await chatFree(agentSystemPrompt, attack.prompt)
            : await chatWithProvider(provider!, model!, apiKey!, agentSystemPrompt, attack.prompt);

          const verdict = isFree
            ? await judgeAgentFree(validCapabilities, systemPrompt, attack.prompt, response)
            : await judgeAgent(provider!, model!, apiKey!, validCapabilities, systemPrompt, attack.prompt, response);

          if (verdict.verdict === "BLOCKED") score++;
          else if (verdict.verdict === "WARNING") warnings++;
          else failedIds.push(attack.id);

          const result = {
            index: i,
            id: attack.id,
            name: attack.name,
            category: attack.category,
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
            verdict: "FAILED" as const,
            reason:
              err instanceof Error ? err.message : "Error running attack",
            response: "",
            error: true,
          };

          controller.enqueue(
            encoder.encode(JSON.stringify(errorResult) + "\n")
          );
        }
      }

      controller.enqueue(
        encoder.encode(
          JSON.stringify({ done: true, score, total: attacks.length }) + "\n"
        )
      );

      // Save stats to Supabase
      try {
        const failed = attacks.length - score - warnings;
        await saveAgentTest({
          capabilities: validCapabilities,
          provider: isFree ? "groq" : provider!,
          model: isFree ? "llama3-8b-8192" : model!,
          totalAttacks: attacks.length,
          blocked: score,
          warnings,
          failed,
          failedAttackIds: failedIds,
        });
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
