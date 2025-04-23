import { createContext, useState, ReactNode, useEffect } from "react";
import { CustomChain } from "@/types";
import CustomChainService from "@/services/custom-chain-service";
import {
  ArbitrumNetwork,
  getArbitrumNetworks,
  registerCustomArbitrumNetwork,
} from "@arbitrum/sdk";
import { arbitrum, arbitrumSepolia } from "viem/chains";
import { FILTERS } from "@/constants";

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
      const lastAddress = localStorage.getItem("last-wallet-address");
      const userChains = await CustomChainService.getUserChains(
        (lastAddress ?? "0x") as `0x${string}`,
        "",
        FILTERS.ALL
      );

      const arbNetworks = getArbitrumNetworks();
      userChains
        .filter((x) => !arbNetworks.some((y) => y.chainId === x.chainId))
        .filter((x) => x.isOrbit)
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

      setChains(userChains as unknown as CustomChain[]);
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
