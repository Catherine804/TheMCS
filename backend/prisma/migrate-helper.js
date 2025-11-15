// CommonJS style
const { execSync } = require("child_process");

// Set DATABASE_URL for this process
process.env.DATABASE_URL = DATABASE_URL="postgresql://postgres:MySecretPassword@localhost:5432/themcs";

// Run Prisma migrate dev
execSync("npx prisma migrate dev --name init", { stdio: "inherit" });
