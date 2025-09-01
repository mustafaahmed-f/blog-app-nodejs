/*
  Warnings:

  - A unique constraint covering the columns `[userEmail,postSlug]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Likes_userEmail_postSlug_key` ON `Likes`(`userEmail`, `postSlug`);
