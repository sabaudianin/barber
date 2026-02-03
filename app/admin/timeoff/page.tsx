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

  return (
    <section className="mx-auto ma-w-6xl p-4">
      <h1 className="text-xl font-bold text-center">Urlopy</h1>
      <div className="flex items-center gap-2">
        <label className="font-bold text-xl">Data</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-2xl border-p-2"
        />
        {timeoffQuery.isLoading && <p>..ŁADOWANIE..</p>}
      </div>
      <div className="flex justify-center items-center">
        {barbersQuery.isLoading ? (
          <p>...Ładowanie barberów</p>
        ) : barbersQuery.isError ? (
          <p className="text-red-500">{barbersQuery.error.message}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {barbers.map((barb) => (
              <button
                key={barb.id}
                className={[
                  "rounded-xl border px-3 py-2",
                  effectiveBarberId === barb.id && "border-4 font-bold",
                ].join()}
                onClick={() => setSelectedBarberId(barb.id)}
              >
                {barb.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="rounded-2xl border p-4 m-2">
        <div className="font-semibold text-center text-xl">Dodaj przerwę</div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-medium">Start</label>
            <input
              type="time"
              className="w-full rounded-lg border p-2"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Koniec</label>
            <input
              type="time"
              className="w-full rounded-lg border p-2"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Powód (opcjonalnie)</label>
            <input
              className="w-full rounded-lg border p-2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Przerwa / Urlop"
            />
          </div>
        </div>

        {addMutation.isError ? (
          <p className="text-sm text-red-500">
            {(addMutation.error as Error).message}
          </p>
        ) : null}

        <button
          className="rounded-xl border bg-black text-white px-4 py-2 disabled:opacity-60 text-center font-bold"
          disabled={!effectiveBarberId || addMutation.isPending}
          onClick={() => addMutation.mutate()}
        >
          {addMutation.isPending ? "Dodaję…" : "Dodaj"}
        </button>
      </div>

      <div className="rounded-2xl border  m-2">
        <div className=" p-3 font-semibold text-xl text-center">
          Zaplanowane Urlopy:
        </div>

        {timeoffQuery.isError ? (
          <div className="p-3 text-red-500">
            {(timeoffQuery.error as Error).message}
          </div>
        ) : rows.length === 0 ? (
          <div className="p-3 text-center">Brak przerw.</div>
        ) : (
          rows.map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between gap-3 p-3 border-t"
            >
              <div>
                <div className="font-medium">
                  {row.start} : {row.end}
                </div>
                {row.reason ? (
                  <div className="text-xs text-gray-500">{row.reason}</div>
                ) : null}
              </div>

              <button
                className="rounded-xl border px-3 py-2 disabled:opacity-60"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(row.id)}
              >
                {deleteMutation.isPending ? "Usuwam…" : "Usuń"}
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
