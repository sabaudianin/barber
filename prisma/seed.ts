import { prisma } from "@/lib/prisma";

async function main() {
  console.log("Seeding db...");

  //clean old data
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.barber.deleteMany();

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
      { name: "Strzyżenie + broda", durationMinutes: 45, price: 70 },
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
