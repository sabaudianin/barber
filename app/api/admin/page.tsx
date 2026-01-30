"use client";

import { useMemo, useState } from "react";
import { DateTime } from "luxon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ZONE } from "@/lib/time/date";

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
      const res = await fetch(`/api/bookings?date=${date}`);
      if (!res.ok) {
        throw new Error("failed to fetch bookings");
      }
      const data = await res.json();
      return data.bookings as Booking[];
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/bookings/${id}`, { method: "PATCH" });
      if (!res.ok) {
        throw new Error("failed to cancel booking");
      }
      return res.json();
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["adminBookings", date] });
      //odswiezenie avialibilty na froncie
      await qc.invalidateQueries({ queryKey: ["availabilityMonth"] });
      await qc.invalidateQueries({ queryKey: ["availabilityDay"] });
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
}
