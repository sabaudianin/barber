export type Barber = { id: string; name: string };

export type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number | null;
};

export type Toast = { type: "success" | "error"; message: string } | null;

export type AvailabilityMonthResponse = { availableDates: string[] };
export type AvailabilityDayResponse = { slots: string[] };
export type CreateBookingResponse = { ok: true } | { ok: false; error: string };
