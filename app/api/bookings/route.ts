import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { prisma } from "@/lib/prisma";
import { ZONE } from "@/lib/time/date";
import { createBookingSchema } from "@/lib/schemas/booking";

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

export async function POST(req: Request) {
  const jsonBody = await req.json().catch(() => null);
  if (!jsonBody) {
    return NextResponse.json({ error: "Invalid Json body !" }, { status: 400 });
  }

  const parsedBody = createBookingSchema.safeParse(jsonBody);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Validation error", details: parsedBody.error },
      { status: 400 },
    );
  }

  const { barberId, serviceId, date, time, customerName, customerPhone } =
    parsedBody.data;

  //parser start
  const start = DateTime.fromISO(`${date}T${time}`, { zone: ZONE });
  if (!start.isValid) {
    return NextResponse.json(
      { error: "invalid date or time . USe YYYY-MM-DD HH:mm" },
      { status: 400 },
    );
  }

  //blokada przeszlosci
  const now = DateTime.now().setZone(ZONE);
  if (start < now.minus({ minutes: 1 })) {
    return NextResponse.json(
      { error: "Cannot booke in the past time" },
      { status: 400 },
    );
  }

  //godzuny otwarcia
  const hours = getOpeningHours(start);
  if (!hours) {
    return NextResponse.json({ error: "CLosed on this time" }, { status: 400 });
  }
  const startMin = start.hour * 60 + start.minute;
  if (startMin < hours.startMinute || startMin >= hours.endMinute) {
    return NextResponse.json({ error: "Outside open hours" }, { status: 400 });
  }

  //get services(duration)
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { durationMinutes: true, name: true },
  });
  if (!service) {
    return NextResponse.json({ error: "service not found" }, { status: 404 });
  }

  //walidacja czy usługa nie wykracza poza working hours
  const end = start.plus({ minutes: service.durationMinutes });
  const endMin = end.hour * 60 + end.minute;
  if (endMin > hours.endMinute) {
    return NextResponse.json(
      { error: "Service end after working hours" },
      { status: 400 },
    );
  }

  //check barber exitst and is active
  const barber = await prisma.barber.findUnique({
    where: { id: barberId },
    select: { id: true, isActive: true, name: true },
  });

  if (!barber || !barber.isActive) {
    return NextResponse.json(
      { error: "barber not found or inactive" },
      { status: 404 },
    );
  }

  //main logic check and create

  try {
    const created = await prisma.$transaction(async (tx) => {
      const conflict = await tx.booking.findFirst({
        where: {
          barberId,
          status: "BOOKED",
          startAt: { lt: end.toJSDate() },
          endAt: { gt: start.toJSDate() },
        },
        select: { id: true },
      });
      //throw error controlled, if conflict
      if (conflict) {
        throw new Error("BOOKING_CONFLICT");
      }

      return tx.booking.create({
        data: {
          barberId,
          serviceId,
          customerName,
          customerPhone,
          startAt: start.toJSDate(),
          endAt: end.toJSDate(),
          status: "BOOKED",
        },
        select: {
          id: true,
          startAt: true,
          endAt: true,
          status: true,
          barber: { select: { id: true, name: true } },
          service: {
            select: {
              id: true,
              name: true,
              durationMinutes: true,
              price: true,
            },
          },
        },
      });
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Error && e?.message === "BOOKING_CONFLICT") {
      return NextResponse.json(
        { error: "Selected time is no longer availible" },
        { status: 409 },
      );
    }
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
