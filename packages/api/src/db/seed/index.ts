import { prisma } from "../index";
import { Prisma } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seed() {
  console.log("🌱 Seeding default chains...");

  // Read the JSON file
  const chainsPath = path.join(__dirname, "../../featured-chains/chains.json");
  const chainsData = JSON.parse(fs.readFileSync(chainsPath, "utf-8"));
  const defaultChains = chainsData.defaultChains;

  for (const chain of defaultChains) {
    const exists = await prisma.chain.findFirst({
      where: { chainId: chain.chainId.toString(), userAddress: null },
    });

    if (!exists) {
      try {
        console.log(`Creating chain: ${chain.name} (${chain.chainId})`);

        const data = {
          name: chain.name,
          chainId: chain.chainId,
          parentChainId: chain.parentChainId,
          chainType: chain.chainType,
          logoURI: chain.logoURI,
          confirmPeriodBlocks: chain.confirmPeriodBlocks,
          isTestnet: chain.isTestnet || false,
          isCustom: chain.isCustom || false,
          featured: chain.featured || false,
          testnet: chain.testnet || false,
          userAddress: null,
          // Required JSON fields
          nativeCurrency: chain.nativeCurrency || Prisma.JsonNull,
          rpcUrls: chain.rpcUrls || Prisma.JsonNull,
          blockExplorers: chain.blockExplorers || Prisma.JsonNull,
          // Optional JSON fields
          contracts: chain.contracts || Prisma.JsonNull,
          ethBridge:
            chain.ethBridge === "0x"
              ? Prisma.JsonNull
              : chain.ethBridge || Prisma.JsonNull,
          explorer: chain.explorer || Prisma.JsonNull,
        };

        await prisma.chain.create({
          data: { ...data, chainId: data.chainId.toString() },
        });
        console.log(`✅ Created chain: ${chain.name}`);
      } catch (error) {
        console.error(`❌ Error creating chain ${chain.name}:`, error);
      }
    } else {
      console.log(
        `Chain ${chain.name} (${chain.chainId}) already exists, skipping.`
      );
    }
  }

  console.log("✅ Seeding completed!");
}

seed()
  .catch((error) => {
    console.error("❌ Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
