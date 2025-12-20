import { prisma } from "../services/prismaClient.js";

async function test() {
  await prisma.$connect();
  console.log("✅ Prisma connected to MySQL");

  const users = await prisma.user.findMany({ take: 1 });
  console.log("✅ Query works:", users);

  await prisma.$disconnect();
}

test().catch((err) => {
  console.error("❌ Prisma error:", err);
});
