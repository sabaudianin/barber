import { z } from "zod";

export const createBookingSchema = z.object({
  barberId: z.string(),
  serviceId: z.string(),
  date: z.string(), // YYYY-MM-DD
  time: z.string(), // HH:mm
  customerName: z.string().min(2),
  customerPhone: z.string(),
});

export type CreateBookingPayload = z.infer<typeof createBookingSchema>;

export const bookingSchema = z.object({
  customerName: z.string().trim().min(2, "Imię musi mieć min. 2 znaki"),
  customerPhone: z.string().trim().or(z.literal("")),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
