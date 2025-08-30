/*
  Warnings:

  - A unique constraint covering the columns `[userEmail,title]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Post_userEmail_title_key` ON `Post`(`userEmail`, `title`);
