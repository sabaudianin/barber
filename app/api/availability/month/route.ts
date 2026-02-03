import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { prisma } from "@/lib/prisma";
import { ZONE, STEP_MINUTES, BOOKING_AFTER_MIN } from "@/lib/time/date";
import {
  getOpeningHours,
  overlaps,
  getBusyForMonth,
} from "@/lib/availability/availabilty";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const barberId = searchParams.get("barberId");
  const serviceId = searchParams.get("serviceId");
  const monthStr = searchParams.get("month");

  if (!barberId || !serviceId || !monthStr) {
    return NextResponse.json(
      { error: "Missing required query parmas : barberId serviceId month" },
      { status: 400 },
    );
  }

  const month = DateTime.fromISO(`${monthStr}-01`, { zone: ZONE });
  if (!month.isValid) {
    return NextResponse.json(
      { error: "INvalid Format use YYYY-MM" },
      { status: 400 },
    );
  }
  //zawezenie do bierzącego miesiąca i następnego po nim
  const now = DateTime.now().setZone(ZONE);

  const currentMonth = now.startOf("month");
  const nextMonth = currentMonth.plus({ months: 1 });
  const requestedMonth = month.startOf("month");

  const monthInRange =
    requestedMonth.hasSame(currentMonth, "month") ||
    requestedMonth.hasSame(nextMonth, "month");

  if (!monthInRange) {
    return NextResponse.json({ error: "Month out of range" }, { status: 400 });
  }

  //zeby dzis nie bylo dostepne jak brak dostepnycgh godzin
  const nowStep = (dt: DateTime) => {
    const base = dt.set({ second: 0, millisecond: 0 });
    const remain = base.minute % STEP_MINUTES;
    return remain === 0 ? base : base.plus({ minutes: STEP_MINUTES - remain });
  };

  //czas ttrwania
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { durationMinutes: true },
  });
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const busy = await getBusyForMonth({ barberId, month });

  //zmiana na time zone warsaw
  const duration = service.durationMinutes;

  //lecimy po dniach  w miesiącu
  const availableDates: string[] = [];
  const daysInMonth = month.daysInMonth;
  const today = now.startOf("day");

  for (let d = 1; d <= daysInMonth; d++) {
    const day = month.set({ day: d });

    const hours = getOpeningHours(day);
    if (day < today) continue; //blokujemy wczesniejsze daty przed today
    if (!hours) continue; //zamknięte

    const openStart = day.set({
      hour: hours.startHour,
      minute: hours.startMinute,
      second: 0,
      millisecond: 0,
    });

    const openEnd = day.set({
      hour: hours.endHour,
      minute: hours.endMinute,
      second: 0,
      millisecond: 0,
    });

    //filteujemy busy tylko dla jednego dnia ,szybicej niz sprawdzac cały miesiącq)
    const dayStart = day.startOf("day");
    const dayEnd = day.endOf("day");
    const busyDay = busy.filter((b) => b.start < dayEnd && b.end > dayStart);

    //poszukujemy pierwszego wolnego slotu, i zeby nie było falszywych wolnych godzin(np 17.20 BOKIING_AFTER =.. nie bedzie dostępne już)
    let cursor: DateTime = openStart;
    if (day.hasSame(now, "day")) {
      const minAllowedTime = nowStep(now.plus({ minutes: BOOKING_AFTER_MIN }));
      cursor = DateTime.max(openStart, minAllowedTime);
    }

    let hasAny = false;

    while (cursor < openEnd) {
      const slotStart = cursor;
      const slotEnd = slotStart.plus({ minutes: duration });
      if (slotEnd > openEnd) break;

      const collides = busyDay.some((b) =>
        overlaps(slotStart, slotEnd, b.start, b.end),
      );
      if (!collides) {
        hasAny = true;
        break; // jak sie znalazl slot to wystarczy ze jest
      }
      cursor = cursor.plus({ minutes: STEP_MINUTES });
    }
    const iso = day.toISODate();
    if (!iso) {
      throw new Error("Invalid date while building month availibility");
    }
    if (hasAny) {
      availableDates.push(iso);
    }
  }

  return NextResponse.json({
    month: month.toFormat("yyyy-MM"),
    barberId,
    serviceId,
    availableDates,
  });
}
