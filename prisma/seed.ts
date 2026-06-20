import { prisma } from "../db/prisma.js";
import bcrypt from "bcrypt";

async function main() {
  const hashedPassword = await bcrypt.hash("admin@123", 10);
  
  const admin = await prisma.users.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      username: "admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Database seeded successfully. Admin credentials created:");
  console.log(`- Username: ${admin.username}`);
  console.log(`- Password: admin@123`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
