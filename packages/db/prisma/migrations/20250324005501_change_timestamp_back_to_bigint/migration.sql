/*
  Warnings:

  - The `delayedInboxTimestamp` column on the `transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "delayedInboxTimestamp",
ADD COLUMN     "delayedInboxTimestamp" BIGINT;
