/*
  Warnings:

  - You are about to drop the column `postId` on the `post_images` table. All the data in the column will be lost.
  - Added the required column `postDraftId` to the `post_images` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `post_images` DROP FOREIGN KEY `post_images_postId_fkey`;

-- DropIndex
DROP INDEX `post_images_postId_fkey` ON `post_images`;

-- AlterTable
ALTER TABLE `post_images` DROP COLUMN `postId`,
    ADD COLUMN `postDraftId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `post_images` ADD CONSTRAINT `post_images_postDraftId_fkey` FOREIGN KEY (`postDraftId`) REFERENCES `Post`(`draftId`) ON DELETE CASCADE ON UPDATE CASCADE;
