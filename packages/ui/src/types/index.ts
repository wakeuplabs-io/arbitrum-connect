import { ArbitrumNetwork } from "@arbitrum/sdk";

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