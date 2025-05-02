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
  getChainById(chainId: number): CustomChain | undefined;
  isLoading: boolean;
};

export const ChainsContext = createContext<ChainsContextType | undefined>(
  undefined
);

export function ChainsProvider({ children }: { children: ReactNode }) {
  const [chains, setChains] = useState<CustomChain[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAllChains = async () => {
      setIsLoading(true);
      const lastAddress = localStorage.getItem("last-wallet-address") as
      | `0x${string}`
      | undefined;
      const userChains = await CustomChainService.getUserChains(lastAddress);
      
      // All chains must be registered to wagmi & to the arb sdk
      const arbNetworks = getArbitrumNetworks();
      //Registering networks to arbitrum sdk
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

      // Setting chains which will be consumed to populate Wagmi config
      setChains(userChains as unknown as CustomChain[]);
      setIsLoading(false);
    };
    getAllChains();
  }, []);

  const getChainById = (chainId: number): CustomChain | undefined => {
    const chain = chains.filter((x) => x.chainId === chainId)[0];

    return chain;
  };

  return (
    <ChainsContext.Provider
      value={{
        chains,
        setChains,
        getChainById,
        isLoading,
      }}
    >
      {children}
    </ChainsContext.Provider>
  );
}
