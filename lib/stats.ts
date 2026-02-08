import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const STATS_FILE = join(process.cwd(), ".stats.json");

interface Stats {
  count: number;
}

let cached: Stats | null = null;

function load(): Stats {
  if (cached) return cached;
  try {
    if (existsSync(STATS_FILE)) {
      const data = JSON.parse(readFileSync(STATS_FILE, "utf-8"));
      cached = { count: Number(data.count) || 0 };
    } else {
      cached = { count: 0 };
    }
  } catch {
    cached = { count: 0 };
  }
  return cached;
}

export function getStats(): Stats {
  return load();
}

export function incrementStats(): Stats {
  const stats = load();
  stats.count += 1;
  cached = stats;
  try {
    writeFileSync(STATS_FILE, JSON.stringify(stats), "utf-8");
  } catch {
    // Silently fail if filesystem is read-only (e.g., serverless)
  }
  return stats;
}
