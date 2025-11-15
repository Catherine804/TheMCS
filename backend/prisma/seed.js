import { PrismaClient } from '../src/generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      user_name: "Sofia",
      goal: "Build muscle"
    }
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => prisma.$disconnect());
