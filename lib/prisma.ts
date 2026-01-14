import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is missing in .env");
}

const adapter = new PrismaPg({ connectionString });

//w next dev moduły mogą sie przeladowywac -singelton chroni przed mnozeniem polaczen do db,Dlatego robimy jeden klient i trzymamy go w globalThis.tak by robil sie w kazdym roucie new PrismaClient()

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
