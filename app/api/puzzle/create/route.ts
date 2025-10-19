import { NextRequest } from "next/server";

export async function POST(_req: NextRequest) {
  return Response.json({ error: "Puzzle feature disabled" }, { status: 404 });
}
