-- CreateTable
CREATE TABLE `post_images` (
    `id` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `public_id` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `post_images` ADD CONSTRAINT `post_images_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`_id`) ON DELETE CASCADE ON UPDATE CASCADE;
