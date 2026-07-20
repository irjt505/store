import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/supabase/seed";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.SEED_SECRET_KEY;

  if (!secret) {
    return NextResponse.json(
      { error: "SEED_SECRET_KEY not configured" },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const results = await seedDatabase();
    return NextResponse.json({ success: true, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
