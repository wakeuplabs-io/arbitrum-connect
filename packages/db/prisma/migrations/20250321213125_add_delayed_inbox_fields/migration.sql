-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "delayedInboxHash" TEXT,
ADD COLUMN     "delayedInboxTimestamp" INTEGER;
