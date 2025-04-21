import { z } from "@hono/zod-openapi";

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

const TokenBridgeSchema = z.object({
  parentGatewayRouter: z.string(),
  childGatewayRouter: z.string(),
  parentErc20Gateway: z.string(),
  childErc20Gateway: z.string(),
  parentCustomGateway: z.string(),
  childCustomGateway: z.string(),
  parentWethGateway: z.string(),
  childWethGateway: z.string(),
  parentWeth: z.string(),
  childWeth: z.string(),
  parentProxyAdmin: z.string(),
  childProxyAdmin: z.string(),
  parentMultiCall: z.string(),
  childMultiCall: z.string(),
});

export const ChainSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  chainId: z.string(),
  parentChainId: z.number().int().nullable(),

  // Structured JSON data
  nativeCurrency: NativeCurrencySchema.optional().nullish(),
  rpcUrls: RpcUrlsSchema.optional().nullish(),
  blockExplorers: BlockExplorersSchema.optional().nullish(),
  contracts: ContractsSchema.optional().nullish(),
  ethBridge: EthBridgeSchema.optional().nullish(),
  explorer: ExplorerSchema.optional().nullish(),
  tokenBridge: TokenBridgeSchema.nullable().optional(),

  // Basic fields
  isTestnet: z.boolean().default(false),
  testnet: z.boolean().optional().nullish(),
  isCustom: z.boolean().default(false),
  isOrbit: z.boolean().default(true),
  featured: z.boolean().default(false),
  logoURI: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        return (
          val.startsWith("/") ||
          val.startsWith("http://") ||
          val.startsWith("https://")
        );
      },
      { message: "logoURI must be a URL or a path starting with /" }
    )
    .nullish(),
  confirmPeriodBlocks: z.number().int().nullish(),

  // User relation
  userAddress: z.string().nullish(),

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
  nativeCurrency: data.nativeCurrency || null || undefined,
  rpcUrls: data.rpcUrls || null || undefined,
  blockExplorers: data.blockExplorers || null || undefined,
  contracts: data.contracts || null || undefined,
  ethBridge: data.ethBridge || null || undefined,
  explorer: data.explorer || null || undefined,
  tokenBridge: data.tokenBridge || null || undefined,
}));

export const UpdateChainSchema = ChainSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).transform((data) => ({
  ...data,
  nativeCurrency: data.nativeCurrency || null || undefined,
  rpcUrls: data.rpcUrls || null || undefined,
  blockExplorers: data.blockExplorers || null || undefined,
  contracts: data.contracts || null || undefined,
  ethBridge: data.ethBridge || null || undefined,
  explorer: data.explorer || null || undefined,
  tokenBridge: data.tokenBridge || null || undefined,
}));

export type Chain = z.infer<typeof ChainSchema>;
