/*
  Warnings:

  - You are about to drop the column `userId` on the `Tag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_userId_fkey";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "userId";
