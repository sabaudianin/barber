import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { prisma } from "@/lib/prisma";
import { ZONE, STEP_MINUTES, BOOKING_AFTER_MIN } from "@/lib/time/date";
import {
  getOpeningHours,
  overlaps,
  getBusyForDay,
} from "@/lib/availability/availabilty";

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

  const busy = await getBusyForDay({ barberId, day });

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

  //nie pokazujemy minionych godzin, ustawiony okres karencji
  const now = DateTime.now().setZone(ZONE);
  const nowStep = (dt: DateTime) => {
    const base = dt.set({ second: 0, millisecond: 0 });
    const remain = base.minute % STEP_MINUTES;
    return remain === 0 ? base : base.plus({ minutes: STEP_MINUTES - remain });
  };
  const minAllowedTime = nowStep(now.plus({ minutes: BOOKING_AFTER_MIN }));

  //generate slots every 30 min

  const slots: string[] = [];

  let cursor: DateTime = openStart;
  if (day.hasSame(now, "day")) {
    cursor = DateTime.max(openStart, minAllowedTime);
  }

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
