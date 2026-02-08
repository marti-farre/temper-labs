# TemperLLM

**Break your AI before hackers do.**

TemperLLM is an open-source security testing tool for LLM system prompts. It runs 15 adversarial attacks across 6 categories against your system prompt and gives you a detailed security report with scores, verdicts, and fix recommendations.

## Features

- **15 adversarial attacks** across 6 categories (Prompt Injection, Jailbreaking, Prompt Leaking, Role Manipulation, Encoding Tricks, Emotional Manipulation)
- **Multi-provider support** — OpenAI, Anthropic, and Mistral
- **Real-time streaming** — results appear as each attack completes
- **Privacy-first** — your API key is never stored or logged
- **Beautiful dark UI** — Linear/Raycast-inspired design with glow effects and animations

## Quick Start

```bash
git clone https://github.com/your-username/temper-llm.git
cd temper-llm
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Configure** — Choose your provider (OpenAI, Anthropic, or Mistral), select a model, and enter your API key
2. **Test** — Paste your system prompt and click "Run Security Test"
3. **Review** — Get a score out of 15, see which attacks passed/failed, and read recommendations

## Supported Models

| Provider | Models |
|----------|--------|
| OpenAI | GPT-4o, GPT-4o Mini, GPT-4 Turbo |
| Anthropic | Claude 3.5 Sonnet, Claude 3.5 Haiku |
| Mistral | Mistral Large, Mistral Small |

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons

## API Key Security

Your API key never leaves your browser except to call the provider's API through our server (to avoid CORS). We never store, log, or access your key. The entire codebase is open source.

## License

MIT
