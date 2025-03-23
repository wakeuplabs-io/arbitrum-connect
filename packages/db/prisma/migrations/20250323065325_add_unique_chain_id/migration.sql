/*
  Warnings:

  - A unique constraint covering the columns `[chainId]` on the table `chains` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "chains" ALTER COLUMN "testnet" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "chains_chainId_key" ON "chains"("chainId");
