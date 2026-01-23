import type { CreateBookingPayload } from "@/lib/schemas/booking";

export async function createBooking(payload: CreateBookingPayload) {
  const res = await fetch("api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? "Booking failed");
  }

  return data;
}
