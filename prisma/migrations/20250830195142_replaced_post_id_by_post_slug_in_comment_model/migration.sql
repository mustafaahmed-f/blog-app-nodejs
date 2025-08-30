/*
  Warnings:

  - You are about to drop the column `postId` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `postSlug` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_postId_fkey`;

-- DropIndex
DROP INDEX `Comment_postId_idx` ON `Comment`;

-- AlterTable
ALTER TABLE `Comment` DROP COLUMN `postId`,
    ADD COLUMN `postSlug` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Comment_postSlug_idx` ON `Comment`(`postSlug`);

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_postSlug_fkey` FOREIGN KEY (`postSlug`) REFERENCES `Post`(`slug`) ON DELETE RESTRICT ON UPDATE CASCADE;
