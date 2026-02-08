import OpenAI from "openai";

export function createClient(apiKey: string): OpenAI {
  return new OpenAI({ apiKey });
}

export async function chat(
  client: OpenAI,
  model: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: 1024,
    temperature: 0.2,
  });
  return response.choices[0]?.message?.content ?? "";
}
