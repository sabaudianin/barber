import { z } from "zod";

export const createBookingSchema = z.object({
  barberId: z.string().min(1),
  serviceId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format daty: YYYY-MM-DD"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Format czasu: HH:mm"),
  customerName: z.string().trim().min(2, "Imię min. 2 znaki").max(20),
  customerPhone: z.string().trim().max(12).or(z.literal("")),
});

export type CreateBookingPayload = z.infer<typeof createBookingSchema>;

export const bookingSchema = z.object({
  customerName: z.string().trim().min(2, "Imię musi mieć min. 2 znaki"),
  customerPhone: z
    .string()
    .trim()

    .or(z.literal(""))
    .refine(
      (v) => {
        if (!v) return true;
        //czyscimy
        const n = v.replace(/[\s()-]/g, "");
        //dajemy mozliwosc prefixu EU i 9 cyfr
        return /^(\+?\d{1,3})?\d{9}$/.test(n);
      },
      { message: "Nieprawidłowy numer telefonu" },
    ),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
