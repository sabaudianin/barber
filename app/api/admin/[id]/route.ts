import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;

  //walidacja
  if (!id) {
    return NextResponse.json({ error: "Missing booking id" }, { status: 400 });
  }

  const update = await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
    select: { id: true, status: true },
  });

  return NextResponse.json({ update });
}
