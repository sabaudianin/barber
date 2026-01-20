"use client";

import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { DateTime } from "luxon";
import { pl } from "react-day-picker/locale";

type Barber = { id: string; name: string };
type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number | null;
};

const ZONE = "Europe/Warsaw";

function toISODate(date: Date): string {
  const iso = DateTime.fromJSDate(date).setZone(ZONE).toISODate();
  if (!iso) throw new Error("Invalid date");
  return iso;
}

export default function BookingPage() {
  //dane z backendu
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  //wybrane barbery i uługi dni przez usera
  const [selectedBarberId, setSelectedBarberId] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);

  //dostepność
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  //strona sie ładuje pobieramy barberów i usługi
  useEffect(() => {
    async function loadInitialData() {
      const [bRes, sRes] = await Promise.all([
        fetch("/api/barbers"),
        fetch("/api/services"),
      ]);
      const [barb, serv] = await Promise.all([bRes.json(), sRes.json()]);
      setBarbers(barb);
      setServices(serv);

      //ustawiamy defaultowe zaznaczenia
      if (barb?.[0]?.id) {
        setSelectedBarberId(barb[0].id);
      }
      if (serv?.[0]?.id) {
        setSelectedServiceId(serv[0].id);
      }
    }
    loadInitialData();
  }, []);

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

  function onChangeBarber(id: string) {
    setSelectedBarberId(id);
    setSelectedDay(undefined);
    setSlots([]);
  }
  function onChangeService(id: string) {
    setSelectedServiceId(id);
    setSelectedDay(undefined);
    setSlots([]);
  }

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
          {barbers.map((barber) => (
            <label
              className="m-1"
              key={barber.id}
            >
              <input
                type="radio"
                name="barber"
                className="peer sr-only"
                checked={selectedBarberId === barber.id}
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
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-bold font-lime p-2 text-center">Wybierz Usługę:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {services.map((service) => (
            <label
              className="m-1"
              key={service.id}
            >
              <input
                type="radio"
                name="service"
                className="peer sr-only"
                checked={selectedServiceId === service.id}
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
          ))}
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
            footer={
              selectedDay
                ? `Wybrany dzień: ${selectedDay.toLocaleDateString()}`
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

        <div>
          <div>
            <p className="text-center font-bold py-2 text-amber-300">
              Wolne godziny:
            </p>
            {!selectedDay ? (
              <p>Wybierz dzień z kalendarza</p>
            ) : loadingSlots ? (
              <p>...Ładowanie ...</p>
            ) : slots.length === 0 ? (
              <p>Brak wolnych terminów</p>
            ) : (
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
            )}
          </div>
        </div>
      </section>
    </section>
  );
}
