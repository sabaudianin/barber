"use client";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookingFormValues,
  bookingSchema,
  CreateBookingPayload,
} from "@/lib/schemas/booking";
import { CreateBookingResponse } from "@/types/types";

type BookingFormProps = {
  createBookingMutation: {
    mutateAsync: (
      payload: CreateBookingPayload,
    ) => Promise<CreateBookingResponse>;
    isPending: boolean;
    isError: boolean;
    error: unknown;
  };
  barberId: string;
  serviceId: string;
  dateISO: string;
  time: string;
  onBooked?: (info: { dateISO: string; time: string }) => void;
  onSuccessClose: () => void;
};

export const BookingForm = ({
  createBookingMutation,
  barberId,
  serviceId,
  dateISO,
  time,
  onSuccessClose,
  onBooked,
}: BookingFormProps) => {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await createBookingMutation.mutateAsync({
      barberId,
      serviceId,
      date: dateISO,
      time,
      customerName: values.customerName,
      customerPhone: values.customerPhone,
    });

    form.reset();
    onBooked?.({ dateISO, time });
    onSuccessClose();
  });

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3"
    >
      <div>
        <label className="text-sm font-medium">Imię</label>
        <input
          className="w-full border rounded-lg p-2"
          {...form.register("customerName")}
        />
        {form.formState.errors.customerName && (
          <p className="text-sm text-red-600">
            {form.formState.errors.customerName.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Telefon</label>
        <input
          className="w-full border rounded-lg p-2"
          {...form.register("customerPhone")}
        />
      </div>

      {createBookingMutation.isError && (
        <p className="text-sm text-red-600">
          {(createBookingMutation.error as Error).message}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-xl bg-amber-500 text-white py-2 disabled:opacity-60 font-extrabold"
        disabled={createBookingMutation.isPending}
      >
        {createBookingMutation.isPending ? "Rezerwuję…" : "Zarezerwuj"}
      </button>
    </form>
  );
};
