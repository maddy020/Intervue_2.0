/*
  Warnings:

  - Added the required column `roomId` to the `Meet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meet" ADD COLUMN     "roomId" TEXT NOT NULL;
