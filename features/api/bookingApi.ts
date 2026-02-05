import type { Barber, Service } from "@/types/types";

export async function fetchBarbers(): Promise<Barber[]> {
  const res = await fetch("/api/barbers");

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to fetch barbers");
  }

  return res.json();
}

export async function fetchServices(): Promise<Service[]> {
  const res = await fetch("api/services");

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to Fetch Services");
  }
  return res.json();
}
