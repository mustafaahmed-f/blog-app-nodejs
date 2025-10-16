/*
  Warnings:

  - A unique constraint covering the columns `[draftId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Post` ADD COLUMN `draftId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Post_draftId_key` ON `Post`(`draftId`);
