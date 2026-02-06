"use client";

import { useCallback, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { DateTime } from "luxon";
import { pl } from "react-day-picker/locale";
import { ZONE, toJsDateIso, toMonthString } from "@/lib/time/date";
import { BookingForm } from "@/components/bookingForm/BookingForm";
import { IoCloseSharp } from "react-icons/io5";
import { useBarbers } from "@/hooks/useBarbers";
import { useServices } from "@/hooks/useServices";
import { useAvailabilityMonth } from "@/hooks/useAvailabilityMonth";
import { useAvailabilityDay } from "@/hooks/useAvailabilityDay";
import { useCreateBooking } from "@/hooks/useCreateBooking";
import { useEsc } from "@/hooks/useEsc";
import { useToast } from "@/hooks/useToast";

export default function BookingPage() {
  //wybrane barbery i uługi dni przez usera
  const [selectedBarberId, setSelectedBarberId] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState<Date>(new Date());

  //godzina kliknieta
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  //modal
  const [isOpen, setIsOpen] = useState(false);

  //liczymy day w jednym miejscu
  const selectedDayIso = useMemo(
    () => (selectedDay ? toJsDateIso(selectedDay) : null),
    [selectedDay],
  );

  const calendarLimits = useMemo(() => {
    const now = DateTime.now().setZone(ZONE);

    const today = now.startOf("day").toJSDate();
    const startMonth = now.startOf("month").toJSDate();
    const endMonth = now
      .startOf("month")
      .plus({ months: 1 })
      .startOf("month")
      .toJSDate();
    const toDate = now
      .startOf("month")
      .plus({ months: 1 })
      .endOf("month")
      .toJSDate();

    return { today, startMonth, endMonth, toDate };
  }, []);

  const { today, startMonth, endMonth, toDate } = calendarLimits;
  //zapytania API

  const barbersQuery = useBarbers();
  const servicesQuery = useServices();

  const barbers = barbersQuery.data ?? [];
  const services = servicesQuery.data ?? [];

  const effectiveBarberId = selectedBarberId || barbers[0]?.id || "";
  const effectiveServiceId = selectedServiceId || services[0]?.id || "";

  const monthStr = toMonthString(month);

  const availabilityMonthQuery = useAvailabilityMonth({
    barberId: effectiveBarberId,
    serviceId: effectiveServiceId,
    month: monthStr,
  });

  const availableDatesSet = useMemo(() => {
    return new Set<string>(availabilityMonthQuery.data?.availableDates ?? []);
  }, [availabilityMonthQuery.data]);

  const availabilityDayQuery = useAvailabilityDay({
    barberId: effectiveBarberId,
    serviceId: effectiveServiceId,
    date: selectedDayIso,
  });

  const createBookingMutation = useCreateBooking({
    barberId: effectiveBarberId,
    serviceId: effectiveServiceId,
    month: monthStr,
    date: selectedDayIso,
  });

  //jesli zminie barbera usługe reset dnia i slotów zeby nie pokazywać starych już nie aktualnych
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedTime(null);
  }, []);

  const onChangeBarber = useCallback(
    (id: string) => {
      setSelectedBarberId(id);
      setSelectedDay(undefined);
      closeModal();
    },
    [closeModal],
  );

  const onChangeService = useCallback(
    (id: string) => {
      setSelectedServiceId(id);
      setSelectedDay(undefined);
      closeModal();
    },
    [closeModal],
  );

  //funkcja wyswietlająca wolne sloty
  const slotsContent = useMemo(() => {
    const slots = availabilityDayQuery.data?.slots ?? [];

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
  }, [
    selectedDay,
    availabilityDayQuery.data, // zależymy od data, nie od slots
    availabilityDayQuery.isLoading,
    availabilityDayQuery.isError,
  ]);

  //kropeczka dostępności use memo bo przekazujemy ddalej
  const modifiers = useMemo(() => {
    return {
      available: (date: Date) => availableDatesSet.has(toJsDateIso(date)),
    };
  }, [availableDatesSet]);

  const modifiersClassNames = { available: "day-available" };

  useEsc(isOpen, closeModal);
  const { toast, showToast } = useToast(4000);

  return (
    <section className="mx-auto max-w-6xl py-4">
      <div>
        <h1 className="font-diplomata text-center py-4">Rezerwacja usługi:</h1>
      </div>

      <div>
        <h2 className="font-bold font-lime p-2 text-center">
          Wybierz Barbera:
        </h2>
        <div className="flex justify-center items-center max-w-6xl select-none">
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

      <div className="mx-auto max-w-4xl">
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

                <span className="relative flex flex-col items-center justify-center rounded-lg border-2 border-amber-500 bg-amber-100 transition duration-150 cursor-pointer hover:border-amber-900 hover:before:opacity-100 hover:before:scale-100 peer-checked:border-amber-100 peer-checked:bg-amber-400 peer-focus:background-red-500">
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

        <div className="py-4">{slotsContent}</div>
      </section>

      {toast && (
        <div
          className={`z-50 mx-auto m-4 max-w-md rounded-2xl border p-4 text-center font-bold
             ${toast.type === "success" ? "border-green-300 bg-green-500/50" : "border-red-300 bg-red-50"}`}
        >
          {toast.message}
        </div>
      )}

      {isOpen && selectedDay && selectedTime && selectedDayIso && (
        <div
          className="flex items-center justify-center bg-black/20 p-4"
          onMouseDown={closeModal}
        >
          <div
            className="relative w-full max-w-md rounded-2xl shadow-xl bg-amber-100/20 p-6"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <h3 className="font-bold">Potwierdz rezerwację</h3>
                <p>dzień: {selectedDayIso}</p>
                <p>godzina: {selectedTime}</p>
              </div>
              <div className="">
                <button
                  onClick={closeModal}
                  aria-label="Zamknij"
                  className="p-3 rounded-lg hover:bg-white/20 absolute top-0 right-0 font-extrabold"
                >
                  <IoCloseSharp className="text-amber-500 text-xl" />
                </button>
              </div>
            </div>

            <BookingForm
              createBookingMutation={createBookingMutation}
              barberId={effectiveBarberId}
              serviceId={effectiveServiceId}
              time={selectedTime}
              dateISO={selectedDayIso}
              onBooked={({ dateISO, time }) => {
                showToast({
                  type: "success",
                  message: `Rezerwacja potwierdzona, ${dateISO} - ${time}`,
                });
              }}
              onSuccessClose={() => {
                setIsOpen(false);
                setSelectedTime(null);
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
