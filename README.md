# TemperLLM

**Red team your AI agents and prompts before attackers do.**

TemperLLM is an open-source security testing tool for LLM systems. It runs adversarial attacks against your system prompts and AI agents, giving you a detailed security report with scores, verdicts, and recommendations.

## Features

### Prompt Testing
- **25 adversarial attacks** across 7 categories (Prompt Leaking, Context Manipulation, Roleplay, Encoding, Crescendo, Evaluation Exploit, Emotional)
- Test system prompts for jailbreaks, prompt injection, and information leakage

### Agent Testing
- **36 capability-based attacks** across 5 categories (Data Exfiltration, Unauthorized Actions, Code Execution, Persistence, Reconnaissance)
- Test AI agents with tools (email, files, terminal, web, database, payment, etc.)
- Automated judge evaluates if agents follow malicious instructions

### General
- **Multi-provider support** — OpenAI, Anthropic, Mistral, Groq (free tier available)
- **Real-time streaming** — results appear as each attack completes
- **Privacy-first** — your API key is never stored or logged
- **Stats tracking** — Supabase integration for anonymous aggregate statistics
- **Clean UI** — Editorial premium design with forest green accents

## Quick Start

```bash
git clone https://github.com/marti-farre/temperlabs.git
cd temperlabs
npm install
cp .env.example .env.local  # Add your API keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Prompt Testing Mode
1. **Configure** — Choose your provider (OpenAI, Anthropic, Mistral, or Groq), select a model, and enter your API key
2. **Test** — Paste your system prompt and click "Run Security Test"
3. **Review** — Get a score out of 25, see which attacks passed/failed, and read recommendations

### Agent Testing Mode
1. **Configure** — Select which capabilities your agent has (email, files, payment, etc.)
2. **Define** — Write your agent's system prompt with security rules
3. **Test** — TemperLLM runs targeted attacks based on selected capabilities
4. **Review** — See which attacks the agent blocked, warned about, or failed

## Supported Providers & Models

| Provider | Models | Notes |
|----------|--------|-------|
| OpenAI | GPT-4o, GPT-4o Mini, GPT-4 Turbo | Full support |
| Anthropic | Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus | Full support |
| Mistral | Mistral Large, Mistral Small | Full support |
| Groq | Llama 3.1 8B, Llama 3.3 70B, Mixtral 8x7B | Free tier available! |

## Environment Variables

Create a `.env.local` file:

```bash
# Optional: For stats tracking
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: For free model testing
GROQ_API_KEY=gsk_your_groq_api_key
```

Or test with your own API keys via the UI (no environment variables needed).

## Deployment

Deploy to Cloudflare Pages, Vercel, or any Next.js-compatible platform.

See [DEPLOY_CLOUDFLARE.md](DEPLOY_CLOUDFLARE.md) for Cloudflare Pages setup.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase (optional, for stats)

## API Key Security

Your API key never leaves your browser except to call the provider's API through our server (to avoid CORS). We never store, log, or persist your key. The entire codebase is open source for verification.

## Contributing

Contributions welcome! Feel free to:
- Add new attack patterns
- Support additional providers
- Improve the judge accuracy
- Enhance the UI/UX

## License

MIT — see [LICENSE](LICENSE) for details.

