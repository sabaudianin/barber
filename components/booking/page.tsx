"use client";

import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { DateTime } from "luxon";
import { pl } from "react-day-picker/locale";
import { useQuery } from "@tanstack/react-query";

type Barber = { id: string; name: string };

type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number | null;
};

const ZONE = "Europe/Warsaw";

const toISODate = (date: Date): string => {
  const iso = DateTime.fromJSDate(date).setZone(ZONE).toISODate();
  if (!iso) throw new Error("Invalid date");
  return iso;
};

//ustwiamy miesiac

const toMonthString = (date: Date): string => {
  return DateTime.fromJSDate(date).setZone(ZONE).toFormat("yyyy-MM");
};

export default function BookingPage() {
  //wybrane barbery i uługi dni przez usera
  const [selectedBarberId, setSelectedBarberId] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");

  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState<Date>(new Date());

  //dostepność
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [loadingMonth, setLoadingMonth] = useState(false);

  //modal
  const [isOpen, setIsOpen] = useState(false);

  //godzina kliknieta
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  //formularz
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");

  //komunikaty

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

  const availabilityMonthQuery = useQuery({
    queryKey: [
      "availabilityMonth",
      effectiveBarberId,
      effectiveServiceId,
      toMonthString(month),
    ],
    enabled: !!effectiveBarberId && !!effectiveServiceId,
    queryFn: async () => {
      const msc = toMonthString(month);
      const url = `/api/availability/month?barberId=${encodeURIComponent(
        effectiveBarberId,
      )}&serviceId=${encodeURIComponent(effectiveServiceId)}&month=${msc}`;
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

  //pobieranie dostępnych dni miesiąca
  useEffect(() => {
    async function loadMonthAvailability() {
      if (!selectedBarberId || !selectedServiceId) return;

      setLoadingMonth(true);

      const msc = toMonthString(month);
      const url = `/api/availability/month?barberId=${encodeURIComponent(selectedBarberId)}&serviceId=${encodeURIComponent(selectedServiceId)}&month=${msc}`;

      const result = await fetch(url);
      const data = await result.json();

      setAvailableDates(new Set<string>(data.availableDates ?? []));
      setLoadingMonth(false);
    }

    loadMonthAvailability();
  }, [selectedBarberId, selectedServiceId, month]);

  //zamian paramterów barbera, service , day - pobieranie wolnych slotów

  useEffect(() => {
    async function loadSlots() {
      if (!selectedBarberId || !selectedServiceId || !selectedDay) return;
      setLoadingSlots(true);
      setSlots([]);

      const date = toISODate(selectedDay);
      const url = `/api/availability?barberId=${encodeURIComponent(selectedBarberId)}&serviceId=${encodeURIComponent(selectedServiceId)}&date=${date}`;

      const result = await fetch(url);
      const data = await result.json();

      setSlots(data.slots ?? []);
      setLoadingSlots(false);
    }
    loadSlots();
  }, [selectedBarberId, selectedServiceId, selectedDay]);

  //jesli zminie barbera usługe reset dnia i slotów zeby nie pokazywać starych już nie aktualnych

  const onChangeBarber = (id: string) => {
    setSelectedBarberId(id);
    setSelectedDay(undefined);
    setSlots([]);
    setAvailableDates(new Set());
  };
  const onChangeService = (id: string) => {
    setSelectedServiceId(id);
    setSelectedDay(undefined);
    setSlots([]);
    setAvailableDates(new Set());
  };

  //funkcja wyswietlająca wolne sloty
  const renderSlots = () => {
    if (!selectedDay)
      return <p className="text-center">Wybierz dzień z kalendarza</p>;
    if (loadingSlots) return <p>...Ładowanie ...</p>;
    if (slots.length === 0) return <p>Brak wolnych terminów</p>;

    return (
      <div className="flex flex-wrap gap-2">
        {slots.map((slot) => (
          <button
            key={slot}
            className="border p-3 rounded-2xl border-amber-500"
            onClick={() =>
              console.log(`Wybrano ${toISODate(selectedDay)} ${slot}`)
            }
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

  console.log("selectedServiceId:", selectedServiceId);

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

                <span
                  className="relative flex flex-col items-center justify-center w-20 min-h-20 rounded-lg border-2 border-amber-500 bg-amber-100 transition duration-150 cursor-pointer hover:border-amber-900 before:content-[''] before:absolute before:block before:w-3 before:h-3 before:rounded-full before:border-2  before:bg-green-500 before:top-1 before:left-1 before:opacity-0 before:scale-0 before:transition before:duration-200 hover:before:opacity-100 hover:before:scale-100 peer-checked:border-amber-100 
                 peer-checked:bg-amber-400 peer-checked:before:opacity-100 peer-checked:before:scale-100 peer-checked:before:bg-amber-600 peer-checked:before:border-amber-700 peer-focus:background-red-500"
                >
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
          {barbersQuery.isLoading ? (
            <p>Ładowanie usług…</p>
          ) : barbersQuery.isError ? (
            <p>Błąd: {(barbersQuery.error as Error).message}</p>
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

                <span
                  className="relative flex flex-col items-center justify-center rounded-lg border-2 border-amber-500 bg-amber-100 transition duration-150 cursor-pointer hover:border-amber-900 hover:before:opacity-100 hover:before:scale-100 peer-checked:border-amber-100 
                peer-checked:bg-amber-400 peer-focus:background-red-500"
                >
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
                : loadingMonth
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
    </section>
  );
}
