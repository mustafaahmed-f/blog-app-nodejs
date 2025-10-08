/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clerkId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_userId_fkey`;

-- AlterTable
ALTER TABLE `Post` MODIFY `delta` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `password`,
    ADD COLUMN `clerkId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Account`;

-- CreateIndex
CREATE UNIQUE INDEX `User_clerkId_key` ON `User`(`clerkId`);
