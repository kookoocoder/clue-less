type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions<TBody> {
  method?: HttpMethod;
  body?: TBody;
}

export async function apiFetch<TResponse, TBody = unknown>(
  url: string,
  options?: FetchOptions<TBody>
): Promise<TResponse> {
  const res = await fetch(url, {
    method: options?.method ?? "POST",
    headers: { "Content-Type": "application/json" },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as TResponse;
}


