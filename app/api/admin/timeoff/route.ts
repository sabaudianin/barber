import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { prisma } from "@/lib/prisma";
import { ZONE } from "@/lib/time/date";
import { createTimeOffSchema } from "@/lib/schemas/timeoff";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const barberId = searchParams.get("barberId");
  const date = searchParams.get("date");

  if (!barberId) {
    return NextResponse.json({ error: "Misiing barber ID" }, { status: 400 });
  }

  if (!date) {
    return NextResponse.json({ error: "Misiing date" }, { status: 400 });
  }

  const day = DateTime.fromISO(date, { zone: ZONE });
  if (!day.isValid) {
    return NextResponse.json(
      { error: "Invalide date format" },
      { status: 400 },
    );
  }

  const start = day.startOf("day").toUTC();
  const end = day.endOf("day").toUTC();

  const items = await prisma.timeOff.findMany({
    where: {
      barberId,
      startAt: { lte: end.toJSDate() },
      endAt: { gte: start.toJSDate() },
    },
    orderBy: { startAt: "asc" },
    select: {
      id: true,
      barberId: true,
      startAt: true,
      endAt: true,
      reason: true,
      createdAt: true,
      barber: { select: { id: true, name: true } },
    },
  });
  return NextResponse.json({ date, barberId, items });
}
