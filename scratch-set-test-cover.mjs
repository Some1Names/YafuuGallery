import "dotenv/config";
import { PrismaClient } from "./generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const manga = await prisma.manga.findFirst({ where: { manga_title: "Test 1" } });
await prisma.manga.update({
  where: { id: manga.id },
  data: { cover_image_url: "/wide.png" },
});

console.log("set cover on", manga.id);
await prisma.$disconnect();
