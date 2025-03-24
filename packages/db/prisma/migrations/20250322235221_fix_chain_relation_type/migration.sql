/*
  Warnings:

  - The primary key for the `chains` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `chains` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `chainId` on the `user_favorite_chains` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "user_favorite_chains" DROP CONSTRAINT "user_favorite_chains_chainId_fkey";

-- AlterTable
ALTER TABLE "chains" DROP CONSTRAINT "chains_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "blockExplorers" DROP NOT NULL,
ALTER COLUMN "nativeCurrency" DROP NOT NULL,
ALTER COLUMN "rpcUrls" DROP NOT NULL,
ADD CONSTRAINT "chains_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_favorite_chains" DROP COLUMN "chainId",
ADD COLUMN     "chainId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_favorite_chains_userAddress_chainId_key" ON "user_favorite_chains"("userAddress", "chainId");

-- AddForeignKey
ALTER TABLE "user_favorite_chains" ADD CONSTRAINT "user_favorite_chains_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "chains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
