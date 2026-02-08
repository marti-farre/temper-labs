import { promises as fs } from "fs";
import path from "path";

const STATS_FILE = path.join(process.cwd(), ".stats.json");
let count: number | null = null;

async function loadCount(): Promise<number> {
  if (count !== null) return count;
  try {
    const data = await fs.readFile(STATS_FILE, "utf-8");
    count = JSON.parse(data).count || 0;
  } catch {
    count = 0;
  }
  return count as number;
}

export async function getStats(): Promise<number> {
  return loadCount();
}

export async function incrementStats(): Promise<number> {
  const current = await loadCount();
  count = current + 1;
  fs.writeFile(STATS_FILE, JSON.stringify({ count }), "utf-8").catch(() => {});
  return count;
}
