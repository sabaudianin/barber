import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const barbers = await prisma.barber.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
  });
  return NextResponse.json(barbers);
}
