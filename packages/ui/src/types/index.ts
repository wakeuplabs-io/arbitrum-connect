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
 logoUrl?: string;
};

export type CustomChain = ArbitrumNetwork & NetworkConfig