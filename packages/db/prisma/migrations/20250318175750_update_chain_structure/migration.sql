/*
  Warnings:

  - You are about to drop the column `bridgeAddress` on the `chains` table. All the data in the column will be lost.
  - You are about to drop the column `currencyDecimals` on the `chains` table. All the data in the column will be lost.
  - You are about to drop the column `currencyName` on the `chains` table. All the data in the column will be lost.
  - You are about to drop the column `currencySymbol` on the `chains` table. All the data in the column will be lost.
  - You are about to drop the column `explorerApiUrl` on the `chains` table. All the data in the column will be lost.
  - You are about to drop the column `explorerUrl` on the `chains` table. All the data in the column will be lost.
  - You are about to drop the column `inboxAddress` on the `chains` table. All the data in the column will be lost.
  - You are about to drop the column `multicallAddress` on the `chains` table. All the data in the column will be lost.
  - You are about to drop the column `multicallBlock` on the `chains` table. All the data in the column will be lost.
  - You are about to drop the column `outboxAddress` on the `chains` table. All the data in the column will be lost.
  - You are about to drop the column `rollupAddress` on the `chains` table. All the data in the column will be lost.
  - You are about to drop the column `rpcUrl` on the `chains` table. All the data in the column will be lost.
  - You are about to drop the column `sequencerAddress` on the `chains` table. All the data in the column will be lost.
  - Added the required column `blockExplorers` to the `chains` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nativeCurrency` to the `chains` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rpcUrls` to the `chains` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chains" DROP COLUMN "bridgeAddress",
DROP COLUMN "currencyDecimals",
DROP COLUMN "currencyName",
DROP COLUMN "currencySymbol",
DROP COLUMN "explorerApiUrl",
DROP COLUMN "explorerUrl",
DROP COLUMN "inboxAddress",
DROP COLUMN "multicallAddress",
DROP COLUMN "multicallBlock",
DROP COLUMN "outboxAddress",
DROP COLUMN "rollupAddress",
DROP COLUMN "rpcUrl",
DROP COLUMN "sequencerAddress",
ADD COLUMN     "blockExplorers" JSONB NOT NULL,
ADD COLUMN     "contracts" JSONB,
ADD COLUMN     "ethBridge" JSONB,
ADD COLUMN     "explorer" JSONB,
ADD COLUMN     "nativeCurrency" JSONB NOT NULL,
ADD COLUMN     "rpcUrls" JSONB NOT NULL,
ADD COLUMN     "testnet" BOOLEAN,
ALTER COLUMN "chainType" DROP DEFAULT;
