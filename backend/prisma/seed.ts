import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@tradecare.com" },
    update: {},
    create: {
      email: "admin@tradecare.com",
      password: hashedPassword,
      role: "ADMIN",
      admin: {
        create: {
          name: "System Administrator",
        },
      },
    },
  });

  console.log("Seeded admin user:", admin.email);

  const demoFarmers = [
    { name: "John Kamau", email: "john.kamau@example.com", farmSize: 5.5, cropType: "Maize" },
    { name: "Mary Wanjiku", email: "mary.wanjiku@example.com", farmSize: 3.2, cropType: "Coffee" },
    { name: "Peter Omondi", email: "peter.omondi@example.com", farmSize: 8.0, cropType: "Tea" },
  ];

  for (const farmer of demoFarmers) {
    const farmerPassword = await bcrypt.hash("farmer123", 12);
    await prisma.user.upsert({
      where: { email: farmer.email },
      update: {},
      create: {
        email: farmer.email,
        password: farmerPassword,
        role: "FARMER",
        farmer: {
          create: {
            name: farmer.name,
            farmSize: farmer.farmSize,
            cropType: farmer.cropType,
          },
        },
      },
    });
    console.log("Seeded farmer:", farmer.email);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
