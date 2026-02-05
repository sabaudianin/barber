import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// 1. Rozwiązujemy problem z dotenv i ESLintem
if (typeof window === "undefined" && !process.env.NEXT_RUNTIME) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("dotenv").config();
}

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Funkcja pomocnicza, aby uniknąć błędów podczas buildu w Dockerze
const createPrismaClient = () => {
  if (connectionString) {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }

  // Jeśli brak connectionString (np. podczas buildu), zwracamy standardowy klient
  // Nie wybuchnie, póki nie spróbujesz wykonać zapytania
  return new PrismaClient();
};

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

async function main() {
  console.log("Seeding db...");

  //clean old data
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.barber.deleteMany();
  await prisma.timeOff.deleteMany();

  //add employers

  const barbers = await prisma.barber.createMany({
    data: [
      { name: "Maja" },
      { name: "Klaudia" },
      { name: "Marek" },
      { name: "Kacper" },
    ],
  });
  console.log("Add barbers:", barbers.count);

  //add services
  await prisma.service.createMany({
    data: [
      { name: "Strzyżenie", durationMinutes: 30, price: 50 },
      { name: "Combo - Strzyżenie + broda", durationMinutes: 45, price: 70 },
      { name: "Sama broda", durationMinutes: 20, price: 30 },
      { name: "Full pakiet", durationMinutes: 60, price: 100 },
    ],
  });

  console.log("Seed finished");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async (): Promise<void> => {
    await prisma.$disconnect();
  });
