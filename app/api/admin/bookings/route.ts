import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { prisma } from "@/lib/prisma";
import { ZONE } from "@/lib/time/date";

//lista rezerwacji, pobieramy i zwracamy rosnąco po godzinach
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  if (!date) {
    return NextResponse.json(
      { error: "IMissing date YYYY-MM-DD" },
      { status: 400 },
    );
  }

  const day = DateTime.fromISO(date, { zone: ZONE });
  if (!day.isValid) {
    return NextResponse.json(
      { error: "Invalid date format YYYY-MM-DD" },
      { status: 400 },
    );
  }

  //zmianiamy date  na zakres startof to endOf
  const start = day.startOf("day").toUTC();
  const end = day.endOf("day").toUTC();

  const bookings = await prisma.booking.findMany({
    where: {
      startAt: { gte: start.toJSDate(), lte: end.toJSDate() },
    },
    orderBy: { startAt: "asc" },
    select: {
      id: true,
      status: true,
      customerName: true,
      customerPhone: true,
      startAt: true,
      endAt: true,
      barber: { select: { id: true, name: true } },
      service: {
        select: { id: true, name: true, durationMinutes: true, price: true },
      },
    },
  });
  return NextResponse.json({ date, bookings });
}
