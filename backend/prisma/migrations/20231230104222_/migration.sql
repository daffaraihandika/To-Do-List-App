/*
  Warnings:

  - A unique constraint covering the columns `[namaTag,userId]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tag_namaTag_userId_key" ON "Tag"("namaTag", "userId");
