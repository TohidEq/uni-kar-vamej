export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { url, site } = body;

  const newUser = { id: Date.now(), url, site };

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
