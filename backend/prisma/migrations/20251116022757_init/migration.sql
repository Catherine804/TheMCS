-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "goal" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "user_name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_name_key" ON "User"("user_name");
