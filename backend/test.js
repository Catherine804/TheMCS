import { prisma } from "./prisma/client.js";

async function test() {
  console.log("Testing Prisma Client...");
  
  try {
    // Try to create a user
    const user = await prisma.user.create({
      data: { user_name: "test_user_" + Date.now() }
    });
    console.log("✓ User created successfully:", user);
    console.log("✓ Prisma Client is using the NEW schema!");
  } catch (err) {
    console.error("✗ Error:", err.message);
    console.log("✗ Prisma Client is still using the OLD schema!");
  }
  
  await prisma.$disconnect();
}

test();