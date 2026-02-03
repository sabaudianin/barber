"use client";

import { useMemo, useState } from "react";
import { DateTime } from "luxon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ZONE, toDateIso } from "@/lib/time/date";

type Barber = { id: string; name: string };
type TimeOffItem = {
  id: string;
  startAt: string; // ISO
  endAt: string; // ISO
  reason: string | null;
  barber: { id: string; name: string };
};
type ApiError = {
  error?: string;
};

export default function AdminTimeOffs() {
  const qc = useQueryClient();
  const [date, setDate] = useState(() => toDateIso(DateTime.now()));
  const [selectedBarberId, setSelectedBarberId] = useState<string>("");

  // form
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [reason, setReason] = useState("");

  //barber query
  const barbersQuery = useQuery({
    queryKey: ["barbers"],
    queryFn: async () => {
      const res = await fetch("/api/barbers");
      if (!res.ok) throw new Error("failed to fetch barbers");
      return (await res.json()) as Barber[];
    },
  });

  const barbers = barbersQuery.data ?? [];
  const effectiveBarberId = selectedBarberId || barbers[0]?.id || "";

  //timeoff query

  const timeoffQuery = useQuery({
    queryKey: ["adminTimeoff", effectiveBarberId, date],
    enabled: !!effectiveBarberId && !!date,
    queryFn: async () => {
      const url = `/api/admin/timeoff?barberId=${encodeURIComponent(effectiveBarberId)}&date=${encodeURIComponent(date)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch timeOff");
      const data = await res.json();
      return (data.items ?? []) as TimeOffItem[];
    },
  });

  const items = timeoffQuery.data ?? [];

  //dodawanie
  const addMutation = useMutation({
    mutationFn: async () => {
      const startAt = `${date}T${startTime}`;
      const endAt = `${date}T${endTime}`;

      const res = await fetch("/api/admin/timeoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barberId: effectiveBarberId,
          startAt,
          endAt,
          reason: reason || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "failed to add timeoff");
      return data;
    },
    onSuccess: async () => {
      setReason("");
      await qc.invalidateQueries({
        queryKey: ["adminTimeoff", effectiveBarberId, date],
      });
      await qc.invalidateQueries({ queryKey: ["availabilityDay"] });
      await qc.invalidateQueries({ queryKey: ["availabilityMonth"] });
    },
  });

  //usuwanie
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/timeoff/${id}`, { method: "DELETE" });
      //DELETE często nie zwraca nic albo zwraca 204,albo tylko status, dlatego body nie jest potrzebne,mozna np: let data = null;try {data = await res.json();} catch {}

      const data = (await res.json().catch(() => null)) as ApiError | null;
      if (!res.ok) throw new Error(data?.error ?? "failed to delete items");
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: ["adminTimeoff", effectiveBarberId, date],
      });
      await qc.invalidateQueries({ queryKey: ["availabilityDay"] });
      await qc.invalidateQueries({ queryKey: ["availabilityMonth"] });
    },
  });

  const rows = useMemo(() => {
    return items.map((it) => {
      const start = DateTime.fromISO(it.startAt)
        .setZone(ZONE)
        .toFormat("HH:mm");
      const end = DateTime.fromISO(it.endAt).setZone(ZONE).toFormat("HH:mm");
      return { ...it, start, end };
    });
  }, [items]);

  return null;
}
