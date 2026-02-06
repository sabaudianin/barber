import type {
  Barber,
  Service,
  AvailabilityMonthResponse,
  AvailabilityDayResponse,
} from "@/types/types";

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

export async function fetchAvailabilityMonth(params: {
  barberId: string;
  serviceId: string;
  month: string;
}): Promise<AvailabilityMonthResponse> {
  //zamiast recznego encodeUriComponent w url, URLSearchParams zrobi encode i bedzie czysciej i jeszce zrobi toString()
  const q = new URLSearchParams({
    barberId: params.barberId,
    serviceId: params.serviceId,
    month: params.month,
  });

  const res = await fetch(`/api/availability/month?${q.toString()}`);
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to fetch mont availibilty");
  }
  return res.json();
}

export async function fetchAvailabilityDay(params: {
  barberId: string;
  serviceId: string;
  date: string;
}): Promise<AvailabilityDayResponse> {
  const q = new URLSearchParams({
    barberId: params.barberId,
    serviceId: params.serviceId,
    date: params.date,
  });

  const res = await fetch(`/api/availability?${q}`);
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to fetch day availibility");
  }
  return res.json();
}
