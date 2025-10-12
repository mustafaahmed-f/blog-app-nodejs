-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_postSlug_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_userEmail_fkey`;

-- DropForeignKey
ALTER TABLE `Likes` DROP FOREIGN KEY `Likes_postSlug_fkey`;

-- DropForeignKey
ALTER TABLE `Likes` DROP FOREIGN KEY `Likes_userEmail_fkey`;

-- DropIndex
DROP INDEX `Comment_userEmail_fkey` ON `Comment`;

-- DropIndex
DROP INDEX `Likes_postSlug_fkey` ON `Likes`;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_postSlug_fkey` FOREIGN KEY (`postSlug`) REFERENCES `Post`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_postSlug_fkey` FOREIGN KEY (`postSlug`) REFERENCES `Post`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;
