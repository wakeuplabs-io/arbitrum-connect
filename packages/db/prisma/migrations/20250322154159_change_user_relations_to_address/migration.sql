/*
  Warnings:

  - You are about to drop the column `userId` on the `chains` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_favorite_chains` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chainId,userAddress]` on the table `chains` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userAddress,chainId]` on the table `user_favorite_chains` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userAddress` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAddress` to the `user_favorite_chains` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chains" DROP CONSTRAINT "chains_userId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_favorite_chains" DROP CONSTRAINT "user_favorite_chains_userId_fkey";

-- DropIndex
DROP INDEX "chains_chainId_userId_key";

-- DropIndex
DROP INDEX "user_favorite_chains_userId_chainId_key";

-- AlterTable
ALTER TABLE "chains" DROP COLUMN "userId",
ADD COLUMN     "userAddress" TEXT;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "userId",
ADD COLUMN     "delayedInboxHash" TEXT,
ADD COLUMN     "delayedInboxTimestamp" INTEGER,
ADD COLUMN     "userAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_favorite_chains" DROP COLUMN "userId",
ADD COLUMN     "userAddress" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "chains_chainId_userAddress_key" ON "chains"("chainId", "userAddress");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorite_chains_userAddress_chainId_key" ON "user_favorite_chains"("userAddress", "chainId");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "users"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chains" ADD CONSTRAINT "chains_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "users"("address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorite_chains" ADD CONSTRAINT "user_favorite_chains_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "users"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
