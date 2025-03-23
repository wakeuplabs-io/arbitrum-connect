import { z } from "@hono/zod-openapi";
import { Prisma } from "db";

export const NativeCurrencySchema = z.object({
  name: z.string(),
  symbol: z.string(),
  decimals: z.number().int(),
});

export const RpcUrlsSchema = z.object({
  default: z.object({
    http: z.array(z.string().url()),
  }),
});

export const BlockExplorersSchema = z.object({
  default: z.object({
    name: z.string(),
    url: z.string().url(),
    apiUrl: z.string().url().optional(),
  }),
});

export const ContractsSchema = z
  .object({
    multicall3: z.object({
      address: z.string(),
      blockCreated: z.number().int(),
    }),
    ensRegistry: z
      .object({
        address: z.string(),
      })
      .optional(),
    ensUniversalResolver: z
      .object({
        address: z.string(),
        blockCreated: z.number().int(),
      })
      .optional(),
  })
  .nullable();

export const EthBridgeSchema = z
  .object({
    bridge: z.string(),
    inbox: z.string(),
    sequencerInbox: z.string(),
    outbox: z.string(),
    rollup: z.string(),
    classicOutboxes: z.record(z.number()).optional(),
  })
  .nullable();

export const ExplorerSchema = z
  .object({
    default: z.object({
      url: z.string().url(),
    }),
  })
  .nullable();

export const ChainSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  chainId: z.number().int(),
  parentChainId: z.number().int().nullable(),

  // Structured JSON data
  nativeCurrency: NativeCurrencySchema.optional().nullable(),
  rpcUrls: RpcUrlsSchema.optional().nullable(),
  blockExplorers: BlockExplorersSchema.optional().nullable(),
  contracts: ContractsSchema.optional().nullable(),
  ethBridge: EthBridgeSchema.optional().nullable(),
  explorer: ExplorerSchema.optional().nullable(),

  // Basic fields
  isTestnet: z.boolean().default(false),
  testnet: z.boolean().optional().nullable(),
  isCustom: z.boolean().default(false),
  chainType: z.string(),
  featured: z.boolean().default(false),
  logoURI: z.string().url().nullable(),
  confirmPeriodBlocks: z.number().int().nullable(),

  // User relation
  userAddress: z.string().nullable(),

  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateChainSchema = ChainSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).transform((data) => ({
  ...data,
  nativeCurrency: data.nativeCurrency || Prisma.JsonNull,
  rpcUrls: data.rpcUrls || Prisma.JsonNull,
  blockExplorers: data.blockExplorers || Prisma.JsonNull,
  contracts: data.contracts || Prisma.JsonNull,
  ethBridge: data.ethBridge || Prisma.JsonNull,
  explorer: data.explorer || Prisma.JsonNull,
}));

export const UpdateChainSchema = ChainSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).transform((data) => ({
  ...data,
  nativeCurrency: data.nativeCurrency || Prisma.JsonNull,
  rpcUrls: data.rpcUrls || Prisma.JsonNull,
  blockExplorers: data.blockExplorers || Prisma.JsonNull,
  contracts: data.contracts || Prisma.JsonNull,
  ethBridge: data.ethBridge || Prisma.JsonNull,
  explorer: data.explorer || Prisma.JsonNull,
}));

export type Chain = z.infer<typeof ChainSchema>;
