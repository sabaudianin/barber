import { DateTime } from "luxon";
import { prisma } from "@/lib/prisma";
import { ZONE } from "@/lib/time/date";

export type OpeningHours = {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
} | null;

//dostepnosci dni w miesciacu mon=1 sun=7
export function getOpeningHours(date: DateTime): OpeningHours {
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
//czy przedziały nachodzą na siebie,sloty moga sie stykac
export function overlaps(
  aStart: DateTime,
  aEnd: DateTime,
  bStart: DateTime,
  bEnd: DateTime,
) {
  return aStart < bEnd && aEnd > bStart;
}

//pobranie zajete sloty dla barbera w dniu
export async function getBusyForDay(params: {
  barberId: string;
  day: DateTime;
}) {
  const { barberId, day } = params;

  //granice dnia
  const dayStart = day.startOf("day");
  const dayEnd = day.endOf("day");

  //dwa zapytania równległe, szybciej niz jedno pom drugim
  const [bookings, timeOff] = await Promise.all([
    prisma.booking.findMany({
      //filtrujemy
      where: {
        barberId,
        status: "BOOKED",
        startAt: { lt: dayEnd.toJSDate() },
        endAt: { gt: dayStart.toJSDate() },
      },
      select: { startAt: true, endAt: true },
    }),
    prisma.timeOff.findMany({
      where: {
        barberId,
        startAt: { lt: dayEnd.toJSDate() },
        endAt: { gt: dayStart.toJSDate() },
      },
      select: { startAt: true, endAt: true },
    }),
  ]);

  //zwracamy tablice busy slotsów ,zmieniamy rekord na obiekt ...bookings
  return [
    ...bookings.map((b) => ({
      start: DateTime.fromJSDate(b.startAt, { zone: "utc" }).setZone(ZONE),
      end: DateTime.fromJSDate(b.endAt, { zone: "utc" }).setZone(ZONE),
    })),
    ...timeOff.map((t) => ({
      start: DateTime.fromJSDate(t.startAt, { zone: "utc" }).setZone(ZONE),
      end: DateTime.fromJSDate(t.endAt, { zone: "utc" }).setZone(ZONE),
    })),
  ];
}

//pobranie zajete sloty dla barbera w miesiacu
export async function getBusyForMonth(params: {
  barberId: string;
  month: DateTime;
}) {
  const { barberId, month } = params;

  //granice dnia
  const monthStart = month.startOf("month");
  const monthEnd = month.endOf("month");

  //dwa zapytania równległe, szybciej niz jedno pom drugim
  const [bookings, timeOff] = await Promise.all([
    prisma.booking.findMany({
      //filtrujemy
      where: {
        barberId,
        status: "BOOKED",
        startAt: { lt: monthEnd.toJSDate() },
        endAt: { gt: monthStart.toJSDate() },
      },
      select: { startAt: true, endAt: true },
    }),
    prisma.timeOff.findMany({
      where: {
        barberId,
        startAt: { lt: monthEnd.toJSDate() },
        endAt: { gt: monthStart.toJSDate() },
      },
      select: { startAt: true, endAt: true },
    }),
  ]);

  //zwracamy tablice busy slotsów ,zmieniamy rekord na obiekt ...bookings
  return [
    ...bookings.map((b) => ({
      start: DateTime.fromJSDate(b.startAt, { zone: "utc" }).setZone(ZONE),
      end: DateTime.fromJSDate(b.endAt, { zone: "utc" }).setZone(ZONE),
    })),
    ...timeOff.map((t) => ({
      start: DateTime.fromJSDate(t.startAt, { zone: "utc" }).setZone(ZONE),
      end: DateTime.fromJSDate(t.endAt, { zone: "utc" }).setZone(ZONE),
    })),
  ];
}
