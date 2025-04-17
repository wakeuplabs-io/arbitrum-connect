-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL,
    "bridgeHash" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "claimStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "parentChainId" INTEGER NOT NULL,
    "childChainId" INTEGER NOT NULL,
    "account" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delayedInboxHash" TEXT,
    "userAddress" TEXT NOT NULL,
    "delayedInboxTimestamp" BIGINT,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chains" (
    "name" TEXT NOT NULL,
    "chainId" TEXT NOT NULL,
    "parentChainId" INTEGER,
    "isTestnet" BOOLEAN NOT NULL DEFAULT false,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "chainType" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "logoURI" TEXT,
    "confirmPeriodBlocks" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "blockExplorers" JSONB,
    "contracts" JSONB,
    "ethBridge" JSONB,
    "explorer" JSONB,
    "nativeCurrency" JSONB,
    "rpcUrls" JSONB,
    "testnet" BOOLEAN DEFAULT false,
    "userAddress" TEXT,
    "id" SERIAL NOT NULL,

    CONSTRAINT "chains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_favorite_chains" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAddress" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,

    CONSTRAINT "user_favorite_chains_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_address_key" ON "users"("address");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_bridgeHash_key" ON "transactions"("bridgeHash");

-- CreateIndex
CREATE UNIQUE INDEX "chains_chainId_userAddress_key" ON "chains"("chainId", "userAddress");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorite_chains_userAddress_chainId_key" ON "user_favorite_chains"("userAddress", "chainId");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "users"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chains" ADD CONSTRAINT "chains_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "users"("address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorite_chains" ADD CONSTRAINT "user_favorite_chains_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "chains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorite_chains" ADD CONSTRAINT "user_favorite_chains_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "users"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

