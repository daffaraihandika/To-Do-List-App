/*
  Warnings:

  - A unique constraint covering the columns `[namaTag]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tag_namaTag_key" ON "Tag"("namaTag");
