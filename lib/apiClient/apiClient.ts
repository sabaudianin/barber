export async function apiClient<T>(url: string): Promise<T> {
  const res = await fetch(url);

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Request failed");
  }

  return data as T;
}
