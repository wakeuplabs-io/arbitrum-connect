// src/contexts/Web3ClientContext.tsx
import React, { createContext, useContext, useRef } from "react";
import { CustomChain } from "@/types";
import { defineChain, createPublicClient, PublicClient, http } from "viem";
import { ethers } from "ethers";

type ClientPair = {
  client: PublicClient;
  provider: ethers.providers.JsonRpcProvider;
};

type Web3ClientContextValue = {
  getClient: (chain: CustomChain) => ClientPair;
};

const Web3ClientContext = createContext<Web3ClientContextValue | undefined>(undefined);

export function Web3ClientProvider({ children }: { children: React.ReactNode }) {
  // cacheRef.current[chainId] = { client, provider }
  const cacheRef = useRef<Record<number, ClientPair>>({});

  const getClient = (chain: CustomChain): ClientPair => {
    const { chainId, rpcUrls } = chain;
    if (!cacheRef.current[chainId]) {
      const viemChain = defineChain({ ...chain, id: chainId,  });
      const client = createPublicClient({
        chain: viemChain,
        transport: http(rpcUrls.default.http[0]),
      });
      const provider = new ethers.providers.JsonRpcProvider(rpcUrls.default.http[0]);
      cacheRef.current[chainId] = { client, provider };
    }
    return cacheRef.current[chainId];
  };

  return (
    <Web3ClientContext.Provider value={{ getClient }}>
      {children}
    </Web3ClientContext.Provider>
  );
}

export function useWeb3Client(chain?: CustomChain) {
  const ctx = useContext(Web3ClientContext);
  if (!ctx) {
    throw new Error("`useWeb3Client` must be used within a `<Web3ClientProvider>`");
  }
  return chain ? ctx.getClient(chain) : { client: undefined, provider: undefined };
}
