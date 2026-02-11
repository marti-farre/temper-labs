import { NextResponse } from "next/server";
import { savePromptTest } from "@/lib/stats";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      provider,
      model,
      totalAttacks,
      blocked,
      warnings,
      failed,
      failedAttackIds,
    } = body;

    await savePromptTest({
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
    console.error("Prompt test stats error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
