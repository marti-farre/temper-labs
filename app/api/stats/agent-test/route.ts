import { NextResponse } from "next/server";
import { saveAgentTest } from "@/lib/stats";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      capabilities,
      provider,
      model,
      totalAttacks,
      blocked,
      warnings,
      failed,
      failedAttackIds,
    } = body;

    await saveAgentTest({
      capabilities,
      provider,
      model,
      totalAttacks,
      blocked,
      warnings,
      failed,
      failedAttackIds,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Agent test stats error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
