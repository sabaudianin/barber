import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: { durationMinutes: "asc" },
    select: {
      id: true,
      name: true,
      durationMinutes: true,
      price: true,
    },
  });
  return NextResponse.json(services);
}
