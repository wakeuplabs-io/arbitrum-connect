import { prisma } from "../index";
import { Prisma } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Ensures that logo paths are correctly formatted,
 * keeping them as relative paths to work in any environment
 */
function normalizeLogoURI(logoURI: string): string {
  // If it's a complete URL (e.g. https://...) leave it as is
  if (logoURI.startsWith("http://") || logoURI.startsWith("https://")) {
    return logoURI;
  }

  // If it already starts with /, leave it as is (relative path from root)
  if (logoURI.startsWith("/")) {
    return logoURI;
  }

  // For any other case, add / at the beginning
  return `/${logoURI}`;
}

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
          logoURI: chain.logoURI ? normalizeLogoURI(chain.logoURI) : null,
          confirmPeriodBlocks: chain.confirmPeriodBlocks,
          isTestnet: chain.isTestnet || false,
          isCustom: chain.isCustom || false,
          isOrbit: chain.isOrbit || false,
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
