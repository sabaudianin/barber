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

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
