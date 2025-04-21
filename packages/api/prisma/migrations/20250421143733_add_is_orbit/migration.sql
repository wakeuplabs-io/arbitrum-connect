/*
  Warnings:

  - You are about to drop the column `chainType` on the `chains` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chains" DROP COLUMN "chainType",
ADD COLUMN     "isOrbit" BOOLEAN NOT NULL DEFAULT false;
