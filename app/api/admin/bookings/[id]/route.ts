import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  console.log("params:", params);
  //walidacja
  if (!id) {
    return NextResponse.json({ error: "Missing booking id" }, { status: 400 });
  }

  //anulowanie
  try {
    const updateBooking = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELED" },
      select: { id: true, status: true },
    });

    return NextResponse.json({ updateBooking });
  } catch {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
}
