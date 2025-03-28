import { createContext, useState, ReactNode, useEffect } from "react";
import { CustomChain } from "@/types";
import CustomChainService from "@/services/custom-chain-service";
import {
  ArbitrumNetwork,
  getArbitrumNetworks,
  registerCustomArbitrumNetwork,
} from "@arbitrum/sdk";
import { arbitrum, arbitrumSepolia } from "viem/chains";

type ChainsContextType = {
  chains: CustomChain[];
  setChains: React.Dispatch<React.SetStateAction<CustomChain[]>>;
};

export const ChainsContext = createContext<ChainsContextType | undefined>(
  undefined
);

export function ChainsProvider({ children }: { children: ReactNode }) {
  const [chains, setChains] = useState<CustomChain[]>([]);

  useEffect(() => {
    const getAllChains = async () => {
      // All chains must be registered to wagmi & to the arb sdk
      const allChains = await CustomChainService.getAllChains();

      // So we de-duplicate since we use the same table for every user
      const dedupedChains = allChains.filter(
        (obj, index, self) =>
          self.findIndex((o) => o.chainId === obj.chainId) === index
      );
      const arbNetworks = getArbitrumNetworks();
      dedupedChains
        .filter((x) => !arbNetworks.some((y) => y.chainId === x.chainId))
        .forEach((chain) => {
          if (
            chain.chainId !== arbitrumSepolia.id &&
            chain.chainId !== arbitrum.id
          ) {
            const arbNetwork = {
              ...chain,
              isCustom: true,
            };
            registerCustomArbitrumNetwork(arbNetwork as ArbitrumNetwork, {
              throwIfAlreadyRegistered: false,
            });
          }
        });

      setChains(dedupedChains as unknown as CustomChain[]);
    };
    getAllChains();
  }, []);

  return (
    <ChainsContext.Provider
      value={{
        chains,
        setChains,
      }}
    >
      {children}
    </ChainsContext.Provider>
  );
}
