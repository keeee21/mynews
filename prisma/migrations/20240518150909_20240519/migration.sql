/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `articles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "articles_url_key" ON "articles"("url");
