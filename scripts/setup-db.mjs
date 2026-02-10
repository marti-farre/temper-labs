import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envPath = resolve(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const [key, ...rest] = trimmed.split("=");
  env[key.trim()] = rest.join("=").trim();
}

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

// Extract project ref from URL
const ref = new URL(url).hostname.split(".")[0];

const SQL = `
CREATE TABLE IF NOT EXISTS agent_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  capabilities TEXT[] NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  total_attacks INTEGER NOT NULL,
  blocked INTEGER NOT NULL,
  warnings INTEGER NOT NULL,
  failed INTEGER NOT NULL,
  failed_attack_ids INTEGER[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS prompt_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  total_attacks INTEGER NOT NULL,
  blocked INTEGER NOT NULL,
  warnings INTEGER NOT NULL,
  failed INTEGER NOT NULL,
  failed_attack_ids INTEGER[] DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_agent_tests_created_at ON agent_tests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_tests_created_at ON prompt_tests(created_at DESC);
`;

// Try using Supabase's internal SQL execution endpoint
const response = await fetch(`${url}/rest/v1/rpc/`, {
  method: "POST",
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({}),
});

// The RPC endpoint won't work for DDL, so let's try the pg endpoint
// which is available in newer Supabase projects
console.log("Attempting to create tables via Supabase SQL API...");

const sqlResponse = await fetch(`https://${ref}.supabase.co/pg/query`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${key}`,
  },
  body: JSON.stringify({ query: SQL }),
});

if (sqlResponse.ok) {
  const result = await sqlResponse.json();
  console.log("Tables created successfully!", result);
} else {
  // Fallback: try the management API
  console.log("Direct SQL endpoint not available. Trying table creation via REST API...");

  // Check if tables exist by trying to query them
  const supabase = createClient(url, key);

  const { error: agentError } = await supabase
    .from("agent_tests")
    .select("id", { count: "exact", head: true });

  const { error: promptError } = await supabase
    .from("prompt_tests")
    .select("id", { count: "exact", head: true });

  if (!agentError && !promptError) {
    console.log("Tables already exist! You're all set.");
    process.exit(0);
  }

  console.log("\n========================================");
  console.log("Automatic table creation not available.");
  console.log("Please run this SQL in your Supabase SQL Editor:");
  console.log("(Go to supabase.com → your project → SQL Editor)");
  console.log("========================================\n");
  console.log(SQL);
  process.exit(1);
}
