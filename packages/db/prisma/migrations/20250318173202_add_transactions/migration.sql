-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL,
    "bridgeHash" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "claimStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "parentChainId" INTEGER NOT NULL,
    "childChainId" INTEGER NOT NULL,
    "account" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_bridgeHash_key" ON "transactions"("bridgeHash");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
