export type ProviderName = "openai" | "anthropic" | "mistral";

export interface ModelOption {
  id: string;
  name: string;
}

export interface Provider {
  id: ProviderName;
  name: string;
  models: ModelOption[];
  keyPlaceholder: string;
  keyPrefix: string;
  docsUrl: string;
}

export const providers: Provider[] = [
  {
    id: "openai",
    name: "OpenAI",
    models: [
      { id: "gpt-4o", name: "GPT-4o" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
    ],
    keyPlaceholder: "sk-...",
    keyPrefix: "sk-",
    docsUrl: "https://platform.openai.com/api-keys",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    models: [
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet" },
      { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku" },
    ],
    keyPlaceholder: "sk-ant-...",
    keyPrefix: "sk-ant-",
    docsUrl: "https://console.anthropic.com/settings/keys",
  },
  {
    id: "mistral",
    name: "Mistral",
    models: [
      { id: "mistral-large-latest", name: "Mistral Large" },
      { id: "mistral-small-latest", name: "Mistral Small" },
    ],
    keyPlaceholder: "Enter your Mistral API key...",
    keyPrefix: "",
    docsUrl: "https://console.mistral.ai/api-keys/",
  },
];

export function getProvider(id: ProviderName): Provider {
  const provider = providers.find((p) => p.id === id);
  if (!provider) throw new Error(`Unknown provider: ${id}`);
  return provider;
}

export function isValidModel(providerId: ProviderName, modelId: string): boolean {
  const provider = getProvider(providerId);
  return provider.models.some((m) => m.id === modelId);
}

// Server-side only: call any provider's chat API
export async function chatWithProvider(
  provider: ProviderName,
  model: string,
  apiKey: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  switch (provider) {
    case "openai":
      return chatOpenAI(apiKey, model, systemPrompt, userMessage);
    case "anthropic":
      return chatAnthropic(apiKey, model, systemPrompt, userMessage);
    case "mistral":
      return chatMistral(apiKey, model, systemPrompt, userMessage);
  }
}

async function chatOpenAI(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey });
  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: 1024,
    temperature: 0.2,
  });
  return response.choices[0]?.message?.content || "";
}

async function chatAnthropic(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
    max_tokens: 1024,
    temperature: 0.2,
  });
  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

async function chatMistral(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const { Mistral } = await import("@mistralai/mistralai");
  const client = new Mistral({ apiKey });
  const response = await client.chat.complete({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    maxTokens: 1024,
    temperature: 0.2,
  });
  const choice = response.choices?.[0];
  return typeof choice?.message?.content === "string"
    ? choice.message.content
    : "";
}
