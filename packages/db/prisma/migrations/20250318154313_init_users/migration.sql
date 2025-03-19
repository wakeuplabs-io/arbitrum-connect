-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_address_key" ON "users"("address");
