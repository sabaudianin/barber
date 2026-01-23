import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { prisma } from "@/lib/prisma";
import { ZONE } from "@/lib/time/date";

type CreateBookingBody = {
  barberId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  customerName: string;
  customerPhone?: string;
};

export async function POST(req: Request) {
  let body: CreateBookingBody;
  try {
    body = (await req.json()) as CreateBookingBody;
  } catch {
    return NextResponse.json({ error: "Invalid Json body" }, { status: 404 });
  }

  const { barberId, serviceId, date, time, customerName, customerPhone } = body;

  if (
    !barberId ||
    !serviceId ||
    !date ||
    !time ||
    !customerName ||
    !customerPhone
  ) {
    return NextResponse.json(
      {
        error:
          "Misiing required fields  barberId, serviceId, date, time, customerName, customerPhone",
      },
      { status: 404 },
    );
  }

  //parser start
  const start = DateTime.fromISO(`${date}T${time}`, { zone: ZONE });
  if (!start.isValid) {
    return NextResponse.json(
      { error: "invalid date or time . USe YYYY-MM-DD HH:mm" },
      { status: 404 },
    );
  }
  //get services(duration)
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { durationMinutes: true, name: true },
  });
  if (!service) {
    return NextResponse.json({ error: "service not found" }, { status: 404 });
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
  const end = start.plus({ minutes: service.durationMinutes });

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
