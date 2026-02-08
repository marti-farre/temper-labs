import { getStats } from "@/lib/stats";

export async function GET() {
  const count = await getStats();
  return Response.json({ count });
}
