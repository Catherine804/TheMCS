import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const user = await prisma.user.create({
    data: {
      user_name: "Sofia"
    }
  });

  // Create a test goal for that user
  await prisma.goal.create({
    data: {
      title: "Build muscle",
      description: "Work out regularly to build strength",
      frequency: "three_week", // 3 days a week
      deadline: new Date("2025-12-31"),
      userId: user.id
    }
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => prisma.$disconnect());




/*import { PrismaClient } from '../src/generated/prisma/index.js';
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
  .finally(async () => prisma.$disconnect());*/
