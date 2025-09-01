-- CreateIndex
CREATE FULLTEXT INDEX `Post_title_desc_idx` ON `Post`(`title`, `desc`);
