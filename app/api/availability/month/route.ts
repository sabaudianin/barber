import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { prisma } from "@/lib/prisma";
import { ZONE, STEP_MINUTES } from "@/lib/time/date";

function getOpeningHours(date: DateTime) {
  const weekday = date.weekday;
  switch (weekday) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return { startHour: 10, startMinute: 0, endHour: 18, endMinute: 0 };
    case 6:
      return { startHour: 9, startMinute: 0, endHour: 15, endMinute: 0 };
    case 7:
      return null;
    default:
      return null;
  }
}

function overlaps(
  aStart: DateTime,
  aEnd: DateTime,
  bStart: DateTime,
  bEnd: DateTime,
) {
  return aStart < bEnd && aEnd > bStart;
}

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

  //czas ttrwania
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { durationMinutes: true },
  });
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  //GRanice miesiąca
  const monthStart = month.startOf("month");
  const monthEnd = month.endOf("month");

  //pobranie bookingów  w miesiącu
  const bookings = await prisma.booking.findMany({
    where: {
      barberId,
      status: "BOOKED",
      startAt: { lt: monthEnd.toJSDate() },
      endAt: { gt: monthStart.toJSDate() },
    },
    select: { startAt: true, endAt: true },
  });

  //zmiana na time zone warsaw
  const busy = bookings.map((b) => ({
    start: DateTime.fromJSDate(b.startAt, { zone: "utc" }).setZone(ZONE),
    end: DateTime.fromJSDate(b.endAt, { zone: "utc" }).setZone(ZONE),
  }));

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

    //poszukujemy pierwszego wolnego slotu
    let cursor = openStart;
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
