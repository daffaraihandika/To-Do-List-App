/*
  Warnings:

  - A unique constraint covering the columns `[userId,namaTag]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Tag_namaTag_key";

-- CreateIndex
CREATE UNIQUE INDEX "Tag_userId_namaTag_key" ON "Tag"("userId", "namaTag");
