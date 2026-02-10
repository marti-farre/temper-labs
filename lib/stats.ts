import { getSupabase } from "./supabase";
import { attacks } from "./attacks";
import { agentAttacks, getAttacksForCapabilities, AgentCapability } from "./agent-attacks";

// Build attack ID → category maps
const promptCategoryMap = new Map<number, string>();
for (const a of attacks) promptCategoryMap.set(a.id, a.category);

const agentCategoryMap = new Map<number, string>();
for (const a of agentAttacks) agentCategoryMap.set(a.id, a.category);

export interface AgentTestStats {
  capabilities: string[];
  provider: string;
  model: string;
  totalAttacks: number;
  blocked: number;
  warnings: number;
  failed: number;
  failedAttackIds: number[];
}

export interface PromptTestStats {
  provider: string;
  model: string;
  totalAttacks: number;
  blocked: number;
  warnings: number;
  failed: number;
  failedAttackIds: number[];
}

export interface CategoryScore {
  total: number;
  blocked: number;
  rate: number; // 0-100
}

export async function saveAgentTest(stats: AgentTestStats): Promise<void> {
  const { error } = await getSupabase().from("agent_tests").insert({
    capabilities: stats.capabilities,
    provider: stats.provider,
    model: stats.model,
    total_attacks: stats.totalAttacks,
    blocked: stats.blocked,
    warnings: stats.warnings,
    failed: stats.failed,
    failed_attack_ids: stats.failedAttackIds,
  });
  if (error) console.error("Failed to save agent test:", error);
}

export async function savePromptTest(stats: PromptTestStats): Promise<void> {
  const { error } = await getSupabase().from("prompt_tests").insert({
    provider: stats.provider,
    model: stats.model,
    total_attacks: stats.totalAttacks,
    blocked: stats.blocked,
    warnings: stats.warnings,
    failed: stats.failed,
    failed_attack_ids: stats.failedAttackIds,
  });
  if (error) console.error("Failed to save prompt test:", error);
}

export async function getGlobalStats() {
  const { data: agentData, count: agentCount } = await getSupabase()
    .from("agent_tests")
    .select("*", { count: "exact" });

  const { data: promptData, count: promptCount } = await getSupabase()
    .from("prompt_tests")
    .select("*", { count: "exact" });

  const totalTests = (agentCount || 0) + (promptCount || 0);

  // Average score across all tests
  let totalBlocked = 0;
  let totalAttacksRun = 0;

  for (const t of agentData || []) {
    totalBlocked += t.blocked;
    totalAttacksRun += t.total_attacks;
  }
  for (const t of promptData || []) {
    totalBlocked += t.blocked;
    totalAttacksRun += t.total_attacks;
  }

  const avgScore = totalAttacksRun > 0
    ? Math.round((totalBlocked / totalAttacksRun) * 100)
    : 0;

  // Per-category scores for agent tests
  const agentCategoryScores = computeAgentCategoryScores(agentData || []);
  const promptCategoryScores = computePromptCategoryScores(promptData || []);

  return {
    count: totalTests,
    agentTests: agentCount || 0,
    promptTests: promptCount || 0,
    avgScore,
    agentCategoryScores,
    promptCategoryScores,
  };
}

function computeAgentCategoryScores(
  tests: Array<{
    capabilities: string[];
    failed_attack_ids: number[];
  }>
): Record<string, CategoryScore> {
  const stats: Record<string, { total: number; failed: number }> = {};

  for (const test of tests) {
    // Derive which attacks were run from capabilities
    const caps = test.capabilities as AgentCapability[];
    const runAttacks = getAttacksForCapabilities(caps);

    for (const attack of runAttacks) {
      const cat = attack.category;
      if (!stats[cat]) stats[cat] = { total: 0, failed: 0 };
      stats[cat].total++;
      if (test.failed_attack_ids.includes(attack.id)) {
        stats[cat].failed++;
      }
    }
  }

  const result: Record<string, CategoryScore> = {};
  for (const [cat, s] of Object.entries(stats)) {
    const blocked = s.total - s.failed;
    result[cat] = {
      total: s.total,
      blocked,
      rate: s.total > 0 ? Math.round((blocked / s.total) * 100) : 0,
    };
  }
  return result;
}

function computePromptCategoryScores(
  tests: Array<{
    failed_attack_ids: number[];
  }>
): Record<string, CategoryScore> {
  const stats: Record<string, { total: number; failed: number }> = {};

  for (const test of tests) {
    // All 25 attacks are always run for prompt tests
    for (const attack of attacks) {
      const cat = attack.category;
      if (!stats[cat]) stats[cat] = { total: 0, failed: 0 };
      stats[cat].total++;
      if (test.failed_attack_ids.includes(attack.id)) {
        stats[cat].failed++;
      }
    }
  }

  const result: Record<string, CategoryScore> = {};
  for (const [cat, s] of Object.entries(stats)) {
    const blocked = s.total - s.failed;
    result[cat] = {
      total: s.total,
      blocked,
      rate: s.total > 0 ? Math.round((blocked / s.total) * 100) : 0,
    };
  }
  return result;
}
