import { createContext, useState, ReactNode } from "react";
import { CustomChain } from "@/types";
import {
  getArbitrumNetworks,
  registerCustomArbitrumNetwork,
} from "@arbitrum/sdk";
import CustomChainService from "@/services/custom-chain-service";
import { arbitrum, arbitrumSepolia } from "viem/chains";

type ChainsContextType = {
  chains: CustomChain[];
  setChains: React.Dispatch<React.SetStateAction<CustomChain[]>>;
};

export const ChainsContext = createContext<ChainsContextType | undefined>(
  undefined,
);

export function ChainsProvider({ children }: { children: ReactNode }) {
  const [chains, setChains] = useState(getAllChains());

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
const getAllChains = () => {
  const allChains = CustomChainService.getAllChains();
  const dedupedChains = allChains.filter(
    (obj, index, self) =>
      self.findIndex((o) => o.chainId === obj.chainId) === index,
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
        registerCustomArbitrumNetwork(arbNetwork, {
          throwIfAlreadyRegistered: false,
        });
      }
    });

  return dedupedChains;
};
