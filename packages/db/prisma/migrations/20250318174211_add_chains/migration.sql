-- CreateTable
CREATE TABLE "chains" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "parentChainId" INTEGER,
    "isTestnet" BOOLEAN NOT NULL DEFAULT false,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "chainType" TEXT NOT NULL DEFAULT 'L2',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "logoURI" TEXT,
    "confirmPeriodBlocks" INTEGER,
    "currencyName" TEXT NOT NULL,
    "currencySymbol" TEXT NOT NULL,
    "currencyDecimals" INTEGER NOT NULL DEFAULT 18,
    "rpcUrl" TEXT NOT NULL,
    "explorerUrl" TEXT,
    "explorerApiUrl" TEXT,
    "multicallAddress" TEXT,
    "multicallBlock" INTEGER,
    "bridgeAddress" TEXT,
    "inboxAddress" TEXT,
    "sequencerAddress" TEXT,
    "outboxAddress" TEXT,
    "rollupAddress" TEXT,
    "userId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_favorite_chains" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "chainId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_favorite_chains_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chains_chainId_userId_key" ON "chains"("chainId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorite_chains_userId_chainId_key" ON "user_favorite_chains"("userId", "chainId");

-- AddForeignKey
ALTER TABLE "chains" ADD CONSTRAINT "chains_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorite_chains" ADD CONSTRAINT "user_favorite_chains_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorite_chains" ADD CONSTRAINT "user_favorite_chains_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "chains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
