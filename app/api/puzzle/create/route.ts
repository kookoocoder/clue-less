export async function POST() {
  return Response.json({ error: "Puzzle feature disabled" }, { status: 404 });
}
