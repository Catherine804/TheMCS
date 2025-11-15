/*import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  try {
    // Fetch all users
    const users = await prisma.user.findMany();
    console.log("Users in database:", users);

    // Optional: insert a test user
    const newUser = await prisma.user.create({
      data: { user_name: "sofia", goal: "Test goal" },
    });
    console.log("Inserted new user:", newUser);
  } catch (err) {
    console.error("Database test failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test(); */