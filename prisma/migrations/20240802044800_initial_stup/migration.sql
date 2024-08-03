/*
  Warnings:

  - You are about to drop the `audios` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `audio` to the `tsets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "audios" DROP CONSTRAINT "audios_tsetId_fkey";

-- DropForeignKey
ALTER TABLE "audios" DROP CONSTRAINT "audios_userId_fkey";

-- AlterTable
ALTER TABLE "tsets" ADD COLUMN     "audio" BYTEA NOT NULL;

-- DropTable
DROP TABLE "audios";
