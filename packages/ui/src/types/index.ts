import { ArbitrumNetwork } from "@arbitrum/sdk";
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

type NetworkConfig = {
 nativeCurrency: NativeCurrency;
 rpcUrls: RpcUrls;
 logoURI?: string;
 user?: string;
 featured?: boolean;
};

export type CustomChain = ArbitrumNetwork & NetworkConfig

export enum ChainType {
  L2 = 'L2',
  L3 = 'L3',
}

export type CreateChainPayload = {
  isTestnet: boolean;
  chainId: number;
  name: string;
  parentChainId: number;
  bridge: string;
  inbox: string;
  sequencerInbox: string;
  outbox: string;
  rollup: string;
  nativeCurrencyName: string;
  nativeCurrencySymbol: string;
  nativeCurrencyDecimals: number;
  publicRpcUrl: string;
  logoURI: string;
  user: Address;
};
