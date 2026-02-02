import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { prisma } from "@/lib/prisma";
import { ZONE } from "@/lib/time/date";
import { createTimeOffSchema } from "@/lib/schemas/timeoff";
import { NEVER } from "zod";

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

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  if (!json) {
    return NextResponse.json(
      { error: "Invalid json body in Post" },
      { status: 400 },
    );
  }

  const parsedItem = createTimeOffSchema.safeParse(json);
  if (!parsedItem.success) {
    return NextResponse.json(
      {
        erro: "Parsing error",
        details: parsedItem.error,
      },
      { status: 400 },
    );
  }

  const { barberId, startAt, endAt, reason } = parsedItem.data;

  //walidacja
  const barber = await prisma.barber.findUnique({
    where: { id: barberId },
    select: { id: true, isActive: true },
  });

  if (!barber || !barber.isActive) {
    return NextResponse.json(
      { error: "Barber inactive or not found" },
      { status: 404 },
    );
  }

  //parsowanie dat
  const start = DateTime.fromISO(startAt, { zone: ZONE });
  const end = DateTime.fromISO(endAt, { zone: ZONE });

  if (!start.isValid || !end.isValid) {
    return NextResponse.json(
      { error: "Invalid start or end use ISO dateTime" },
      { status: 400 },
    );
  }
  if (end <= start) {
    return NextResponse.json(
      { error: "End cannot be before start" },
      { status: 400 },
    );
  }

  const createdItem = await prisma.timeOff.create({
    data: {
      barberId,
      startAt: start.toJSDate(),
      endAt: end.toJSDate(),
      reason: reason ? reason : null,
    },
    select: {
      id: true,
      startAt: true,
      endAt: true,
      reason: true,
      barber: { select: { id: true, name: true } },
    },
  });
  return NextResponse.json(createdItem, { status: 201 });
}
