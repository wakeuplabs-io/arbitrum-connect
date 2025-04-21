import { ArbitrumNetwork } from "@arbitrum/sdk";
import { TokenBridge } from "@arbitrum/sdk/dist/lib/dataEntities/networks";
import { Address } from "viem";

type NativeCurrency = {
  name: string;
  symbol: string;
  decimals: number;
};

type RpcUrls = {
  default: {
    http: string[];
  };
};
type BlockExplorers = {
  default: {
    url: string;
  };
};

type NetworkConfig = {
  id?: number;
  explorer: BlockExplorers;
  nativeCurrency: NativeCurrency;
  rpcUrls: RpcUrls;
  logoURI?: string;
  user?: Address;
  featured?: boolean;
  isOrbit: boolean;
};

export type CustomChain = ArbitrumNetwork & NetworkConfig;

export type CustomChainPayload = {
  isTestnet: boolean;
  chainId: number;
  name: string;
  parentChainId: number;
  bridge: string;
  inbox: string;
  sequencerInbox: string;
  outbox: string;
  rollup: string;
  explorerUrl: string;
  nativeCurrencyName: string;
  nativeCurrencySymbol: string;
  nativeCurrencyDecimals: number;
  publicRpcUrl: string;
  logoURI: string;
  user: Address;
  tokenBridge: TokenBridge;
};

export type NetworkFilter = "mainnet" | "testnet" | "all";
