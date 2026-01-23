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
  // [aStart, aEnd) nachodzi na [bStart, bEnd) jeśli:
  return aStart < bEnd && aEnd > bStart;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const barberId = searchParams.get("barberId");
  const serviceId = searchParams.get("serviceId");
  const dateStr = searchParams.get("date");

  if (!barberId || !serviceId || !dateStr) {
    return NextResponse.json(
      { error: "Missing required qeuery params" },
      { status: 400 },
    );
  }
  //parse date
  const day = DateTime.fromISO(dateStr, { zone: ZONE });
  if (!day.isValid) {
    return NextResponse.json(
      { error: "Invalid date format, use YYY-MM-DD" },
      { status: 400 },
    );
  }

  const hours = getOpeningHours(day);
  if (!hours) {
    return NextResponse.json({ slots: [] });
  }

  //get duration
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { durationMinutes: true },
  });

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const duration = service.durationMinutes;

  //granice dnia
  const dayStart = day.startOf("day");
  const dayEnd = day.endOf("day");

  //get reservation if exist
  const bookings = await prisma.booking.findMany({
    where: {
      barberId,
      status: "BOOKED",
      startAt: { lt: dayEnd.toJSDate() },
      endAt: { gt: dayStart.toJSDate() },
    },
    select: { startAt: true, endAt: true },
  });

  //parse dateTIme ZOne Warsaw
  const busy = bookings.map((b) => ({
    start: DateTime.fromJSDate(b.startAt, { zone: "utc" }).setZone(ZONE),
    end: DateTime.fromJSDate(b.endAt, { zone: "utc" }).setZone(ZONE),
  }));

  //every single day opening hours
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

  //generate slots every 15 min

  const slots: string[] = [];
  let cursor = openStart;

  while (cursor < openEnd) {
    const slotStart = cursor;
    const slotEnd = slotStart.plus({ minutes: duration });

    //slots have fit in opening hours
    if (slotEnd > openEnd) break;

    //check is collide with busy
    const collides = busy.some((b) =>
      overlaps(slotStart, slotEnd, b.start, b.end),
    );
    if (!collides) {
      slots.push(slotStart.toFormat("HH:mm"));
    }
    cursor = cursor.plus({ minutes: STEP_MINUTES });
  }

  return NextResponse.json({
    date: day.toISODate(),
    barberId,
    serviceId,
    durationMinutes: duration,
    slots,
  });
}
