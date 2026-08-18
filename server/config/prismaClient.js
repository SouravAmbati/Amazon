import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function testPrisma() {
  try {
    await prisma.$connect();

    console.log("✅ Prisma connected to database");
  } catch (error) {
    console.error("❌ Prisma error:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();