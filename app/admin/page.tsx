"use client";

import { useMemo, useState } from "react";
import { DateTime } from "luxon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ZONE } from "@/lib/time/date";
import Link from "next/link";
import {
  IoArrowForwardCircleOutline,
  IoCalendarOutline,
} from "react-icons/io5";

type Booking = {
  id: string;
  status: "BOOKED" | "CANCELED";
  customerName: string;
  customerPhone: string | null;
  startAt: string; // ISO z JSON
  endAt: string;
  barber: { id: string; name: string };
  service: {
    id: string;
    name: string;
    durationMinutes: number;
    price: number | null;
  };
};

export default function AdminPage() {
  const qc = useQueryClient();

  const [date, setDate] = useState(() =>
    DateTime.now().setZone(ZONE).toFormat("yyyy-MM-dd"),
  );

  const bookingQuery = useQuery({
    queryKey: ["adminBookings", date],
    queryFn: async () => {
      const res = await fetch(`/api/admin/bookings?date=${date}`);
      if (!res.ok) {
        throw new Error("failed to fetch bookings");
      }
      const data = await res.json();
      return data.bookings as Booking[];
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/bookings/${id}`, { method: "PATCH" });
      const data = await res.json().catch(() => {});
      if (!res.ok) {
        throw new Error(
          data?.error ?? `failed to cancel booking, ${res.status}`,
        );
      }
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["adminBookings", date] });
      //odswiezenie avialibilty na froncie
      await qc.invalidateQueries({ queryKey: ["availabilityMonth"] });
      await qc.invalidateQueries({ queryKey: ["availabilityDay"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const rows = useMemo(() => {
    const bookings = bookingQuery.data ?? [];
    return bookings.map((booked) => {
      const start = DateTime.fromISO(booked.startAt)
        .setZone(ZONE)
        .toFormat("HH:mm");
      const end = DateTime.fromISO(booked.endAt)
        .setZone(ZONE)
        .toFormat("HH:mm");
      return { ...booked, start, end };
    });
  }, [bookingQuery.data]);

  return (
    <section className="mx-auto max-w-6xl py-4 px-1">
      <div className=" p-2">
        <Link
          href="/admin/timeoff"
          className="flex items-center gap-2"
        >
          Przejdz do Urlopy/Przerwy{" "}
          <IoArrowForwardCircleOutline className="text-xl" />
        </Link>
      </div>
      <h1 className="text-center font-bold text-2xl p-2">REZERWACJE</h1>
      <div className="flex flex-col items-center justify-center gap-4">
        <label>Wybierz Dzień</label>

        <div className="relative inline-block">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-2xl border p-2 "
          />

          <IoCalendarOutline className="absolute right-3 top-1/2 -translate-y-1/2  text-white" />
        </div>

        {bookingQuery.isLoading && (
          <p className="text-amber-300">...Ładowanie...</p>
        )}
      </div>

      {bookingQuery.isError ? (
        <div className="text-center text-red-500 font-bold">
          {bookingQuery.error.message}
        </div>
      ) : rows.length === 0 ? (
        <div>
          <p>Brak rezerwacji w dniu</p>
        </div>
      ) : (
        <div className="py-2 text-xs">
          <div className="grid grid-cols-10 gap-2 py-2 px-1 border">
            <div className="col-span-2">Godz</div>
            <div className="col-span-2">Klient</div>
            <div className="col-span-2">Usługa</div>
            <div className="col-span-2">Barber</div>
            <div className="col-span-2">Akcja</div>
          </div>
          {rows.map((booked) => (
            <div
              key={booked.id}
              className="grid grid-cols-10 py-2 px-1 border items-center"
            >
              <div className="col-span-2 ">
                <p>{booked.start}</p>
                <p className="text-xxs">{booked.status}</p>
              </div>
              <div className="col-span-2">
                <p> {booked.customerName} </p>
                <p className="text-xxs">{booked.customerPhone}</p>
              </div>
              <div className="col-span-2 text-xxs">{booked.service.name}</div>
              <div className="col-span-2">{booked.barber.name}</div>
              <div className="col-span-2">
                <button
                  disabled={
                    booked.status !== "BOOKED" || cancelMutation.isPending
                  }
                  onClick={() => cancelMutation.mutate(booked.id)}
                  className="border p-2 rounded-xl"
                >
                  Anuluj
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
