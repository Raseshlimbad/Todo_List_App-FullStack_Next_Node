/*
  Warnings:

  - You are about to drop the column `createdAt` on the `todos` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `todos` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `todos` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "todos" DROP COLUMN "createdAt",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "email";

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
