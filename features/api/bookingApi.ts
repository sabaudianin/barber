import type {
  Barber,
  Service,
  AvailabilityMonthResponse,
  AvailabilityDayResponse,
  CreateBookingResponse,
} from "@/types/types";
import type { CreateBookingPayload } from "@/lib/schemas/booking";

//1 Barberzy
export async function fetchBarbers(): Promise<Barber[]> {
  const res = await fetch("/api/barbers");

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to fetch barbers");
  }

  return res.json();
}

//2 Usulgi
export async function fetchServices(): Promise<Service[]> {
  const res = await fetch("api/services");

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to Fetch Services");
  }
  return res.json();
}

//3 Kropki w miesiacu
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

//4 Godziny w dniu
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

//5 rezerwacja
export async function createBooking(
  payload: CreateBookingPayload,
): Promise<CreateBookingResponse> {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  //celowo const data = await res.json() przed if (!res.ok), bo w POST:przy sukcesie: dostać np. bookingId ,przy błędzie: dostać error i zwykle backend przy POST zwraca JSON i dla ok i dla error.Jeśl inie zwraca JSON, to i tak .catch(() => null) zabezpiecza.

  //const data = await res.json().catch(() => null);

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const msg = data?.error ?? "Booking Failed";
    throw new Error(msg);
  }
  return (data ?? { ok: true }) as CreateBookingResponse;
}
