"use client";

import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { DateTime } from "luxon";
import { pl } from "react-day-picker/locale";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateBookingPayload } from "@/lib/schemas/booking";
import { ZONE, toISODate, toMonthString } from "@/lib/time/date";
import { BookingForm } from "./form/BookingForm";

type Barber = { id: string; name: string };

type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number | null;
};

export default function BookingPage() {
  const queryClient = useQueryClient();

  //wybrane barbery i uługi dni przez usera
  const [selectedBarberId, setSelectedBarberId] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");

  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState<Date>(new Date());

  //modal
  const [isOpen, setIsOpen] = useState(false);

  //godzina kliknieta
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  //zapytania API
  const barbersQuery = useQuery({
    queryKey: ["barbers"],
    queryFn: async () => {
      const result = await fetch("/api/barbers");
      if (!result.ok) throw new Error("failed to fetch barbers");
      return (await result.json()) as Barber[];
    },
  });

  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const result = await fetch("/api/services");
      if (!result.ok) throw new Error("failed to fetch services");
      const data = await result.json();
      return data as Service[];
    },
  });

  const barbers = barbersQuery.data ?? [];
  const services = servicesQuery.data ?? [];

  const effectiveBarberId = selectedBarberId || barbers[0]?.id || "";
  const effectiveServiceId = selectedServiceId || services[0]?.id || "";

  //pobieranie msca

  const monthStr = toMonthString(month);

  const availabilityMonthQuery = useQuery({
    queryKey: [
      "availabilityMonth",
      effectiveBarberId,
      effectiveServiceId,
      monthStr,
    ],
    enabled: !!effectiveBarberId && !!effectiveServiceId,
    queryFn: async () => {
      const url = `/api/availability/month?barberId=${encodeURIComponent(
        effectiveBarberId,
      )}&serviceId=${encodeURIComponent(effectiveServiceId)}&month=${monthStr}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch month availability");
      }
      return (await res.json()) as { availableDates: string[] };
    },
  });

  const availableDatesSet = useMemo(() => {
    return new Set<string>(availabilityMonthQuery.data?.availableDates ?? []);
  }, [availabilityMonthQuery.data]);

  //pobieranie dnia
  const availabilityDayQuery = useQuery({
    queryKey: [
      "availabilityDay",
      effectiveBarberId,
      effectiveServiceId,
      selectedDay ? toISODate(selectedDay) : null,
    ],
    enabled: !!effectiveBarberId && !!effectiveServiceId && !!selectedDay,
    queryFn: async () => {
      if (!effectiveBarberId || !effectiveServiceId || !selectedDay) {
        throw new Error("Missing params for availabilityDayQuery");
      }
      const date = toISODate(selectedDay);
      const url = `/api/availability?barberId=${encodeURIComponent(effectiveBarberId)}&serviceId=${encodeURIComponent(effectiveServiceId)}&date=${date}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch day availability");
      }
      return (await res.json()) as { slots: string[] };
    },
  });
  const createBookingMutation = useMutation({
    mutationFn: async (payload: CreateBookingPayload) => {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Booking failed");
      return data;
    },
    onSuccess: async () => {
      // odświeżamy kropki
      await queryClient.invalidateQueries({
        queryKey: [
          "availabilityMonth",
          effectiveBarberId,
          effectiveServiceId,
          monthStr,
        ],
      });

      // odświeżamy sloty
      if (selectedDay) {
        const dayStr = toISODate(selectedDay);
        await queryClient.invalidateQueries({
          queryKey: [
            "availabilityDay",
            effectiveBarberId,
            effectiveServiceId,
            dayStr,
          ],
        });
      }
    },
  });

  const slots = availabilityDayQuery.data?.slots ?? [];

  //jesli zminie barbera usługe reset dnia i slotów zeby nie pokazywać starych już nie aktualnych
  const closeModal = () => {
    setIsOpen(false);
    setSelectedTime(null);
  };

  const onChangeBarber = (id: string) => {
    setSelectedBarberId(id);
    setSelectedDay(undefined);
    closeModal();
  };
  const onChangeService = (id: string) => {
    setSelectedServiceId(id);
    setSelectedDay(undefined);
    closeModal();
  };

  //funkcja wyswietlająca wolne sloty
  const renderSlots = () => {
    if (!selectedDay) return <p>Wybierz dzień z kalendarza</p>;
    if (availabilityDayQuery.isLoading) return <p>...Ładowanie ...</p>;
    if (availabilityDayQuery.isError) return <p>Błąd ładowania terminów</p>;
    if (slots.length === 0) return <p>Brak wolnych terminów</p>;
    return (
      <div className="flex flex-wrap gap-2">
        {slots.map((slot) => (
          <button
            key={slot}
            className="border p-3 rounded-2xl border-amber-500"
            onClick={() => {
              setSelectedTime(slot);

              setIsOpen(true);
            }}
          >
            {slot}
          </button>
        ))}
      </div>
    );
  };
  //helpery do blokowania dat
  const today = useMemo(
    () => DateTime.now().setZone(ZONE).startOf("day").toJSDate(),
    [],
  );
  const startMonth = useMemo(
    () => DateTime.now().setZone(ZONE).startOf("month").toJSDate(),
    [],
  );
  const endMonth = useMemo(
    () =>
      DateTime.now()
        .setZone(ZONE)
        .startOf("month")
        .plus({ months: 1 })
        .startOf("month")
        .toJSDate(),
    [],
  );
  const toDate = useMemo(
    () =>
      DateTime.now()
        .setZone(ZONE)
        .startOf("month")
        .plus({ months: 1 })
        .endOf("month")
        .toJSDate(),
    [],
  );

  //kropeczka dostępności use memo bo przekazujemy ddalej
  const modifiers = useMemo(() => {
    return {
      available: (date: Date) => availableDatesSet.has(toISODate(date)),
    };
  }, [availableDatesSet]);

  const modifiersClassNames = { available: "day-available" };

  //zamknij modal ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }

      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <section className="mx-auto max-w-6xl py-4">
      <div>
        <h1 className="font-diplomata  text-center py-4">Rezerwacja usługi:</h1>
      </div>

      <div>
        <h2 className="font-bold font-lime p-2 text-center">
          Wybierz Barbera:
        </h2>
        <div className="flex justify-center items-center max-w-[350px] select-none">
          {barbersQuery.isLoading ? (
            <p>Ładowanie barberów…</p>
          ) : barbersQuery.isError ? (
            <p>Błąd: {(barbersQuery.error as Error).message}</p>
          ) : (
            barbers.map((barber) => (
              <label
                className="m-1"
                key={barber.id}
              >
                <input
                  type="radio"
                  name="barber"
                  className="peer sr-only"
                  checked={effectiveBarberId === barber.id}
                  onChange={() => onChangeBarber(barber.id)}
                />

                <span className="relative flex flex-col items-center justify-center w-20 min-h-20 rounded-lg border-2 border-amber-500 bg-amber-100 transition duration-150 cursor-pointer hover:border-amber-900 before:content-[''] before:absolute before:block before:w-3 before:h-3 before:rounded-full before:border-2  before:bg-green-500 before:top-1 before:left-1 before:opacity-0 before:scale-0 before:transition before:duration-200 hover:before:opacity-100 hover:before:scale-100 peer-checked:border-amber-100 peer-checked:bg-amber-400 peer-checked:before:opacity-100 peer-checked:before:scale-100 peer-checked:before:bg-amber-600 peer-checked:before:border-amber-700 peer-focus:background-red-500">
                  <span className="text-black transition peer-checked:font-extrabold font-lime">
                    {barber.name}
                  </span>
                </span>
              </label>
            ))
          )}
        </div>
      </div>

      <div>
        <h2 className="font-bold font-lime p-2 text-center">Wybierz Usługę:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {servicesQuery.isLoading ? (
            <p>Ładowanie usług…</p>
          ) : servicesQuery.isError ? (
            <p>Błąd: {(servicesQuery.error as Error).message}</p>
          ) : (
            services.map((service) => (
              <label
                className="m-1"
                key={service.id}
              >
                <input
                  type="radio"
                  name="service"
                  className="peer sr-only"
                  checked={effectiveServiceId === service.id}
                  onChange={() => onChangeService(service.id)}
                />

                <span className="relative flex flex-col          items-center justify-center rounded-lg border-2 border-amber-500 bg-amber-100 transition duration-150 cursor-pointer hover:border-amber-900 hover:before:opacity-100 hover:before:scale-100 peer-checked:border-amber-100 peer-checked:bg-amber-400 peer-focus:background-red-500">
                  <span className="text-black transition peer-checked:font-extrabold font-semibold">
                    {service.name}
                  </span>
                </span>
              </label>
            ))
          )}
        </div>
      </div>

      <section className="py-8 px-2">
        <div className="flex justify-center items-center">
          <DayPicker
            locale={pl}
            animate
            mode="single"
            selected={selectedDay}
            onSelect={(day) => setSelectedDay(day ?? undefined)}
            month={month}
            onMonthChange={setMonth}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            startMonth={startMonth}
            endMonth={endMonth}
            disabled={[{ before: today }, { after: toDate }]}
            footer={
              selectedDay
                ? `Wybrany dzień: ${selectedDay.toLocaleDateString()}`
                : availabilityMonthQuery.isLoading
                  ? "Ładowanie dostępności miesiąca"
                  : "Wybierz dzień."
            }
            classNames={{
              today: `font-extrabold text-amber-100 border-amber-900 border-2 rounded-4xl`,
              selected: `bg-amber-500 border-amber-500 text-white rounded-3xl`,

              chevron: " fill-amber-900",
              footer: "text-amber-300 font-extrabold text-center",
              caption_label: "text-amber-700",
              head_row: "flex justify-center",
              head_cell: "text-amber-400 font-bold text-center",
            }}
          />
        </div>

        <div className="py-4">{renderSlots()}</div>
      </section>

      {isOpen && selectedDay && selectedTime && (
        <BookingForm
          createBookingMutation={createBookingMutation}
          barberId={effectiveBarberId}
          serviceId={effectiveServiceId}
          time={selectedTime}
          dateISO={toISODate(selectedDay)}
          onSuccessClose={() => {
            setIsOpen(false);
            setSelectedTime(null);
          }}
        />
      )}
    </section>
  );
}
