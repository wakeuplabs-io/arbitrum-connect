import { createContext, useState, ReactNode, useEffect } from "react";
import { CustomChain } from "@/types";
import { zeroAddress } from "viem";
import { defaultCustomChain, defaultCustomMainnet } from "@/lib/wagmi-config";
import CustomChainService from "@/services/custom-chain-service";
import { registerCustomArbitrumNetwork } from "@arbitrum/sdk";

type SelectedChainContextType = {
  loading: boolean;
  selectedChain: CustomChain;
  selectedParentChain: CustomChain;
  setSelectedChain: React.Dispatch<React.SetStateAction<CustomChain>>;
};

export const SelectedChainContext = createContext<
  SelectedChainContextType | undefined
>(undefined);

export function SelectedChainProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [selectedChain, setSelectedChain] =
    useState<CustomChain>(defaultCustomChain);
  const [selectedParentChain, setSelectedParentChain] =
    useState<CustomChain>(defaultCustomMainnet);

  const getChainById = (chainId: number) => {
    setLoading(true);
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains
      ? JSON.parse(storedChains)
      : [];
    const chain = parsedChains.find(
      (chain: CustomChain) => chain.chainId === chainId,
    );
    return chain || null;
  };

  useEffect(() => {
    const getParent = async () => {
      if (selectedChain?.parentChainId) {
        const parentChain = await getChainById(selectedChain?.parentChainId);
        if (parentChain) setSelectedParentChain(parentChain);
      }
    };
    getParent();
  }, [selectedChain?.parentChainId]);

  useEffect(() => {
    if (selectedChain) {
      const arbNetwork = {
        ...selectedChain,
        isCustom: true,
      };

      registerCustomArbitrumNetwork(arbNetwork, {
        throwIfAlreadyRegistered: false,
      });
    }
  }, [selectedChain?.chainId]);

  useEffect(() => {
    const initDefaultChains = async () => {
      const chainExists = await CustomChainService.getChainById(
        defaultCustomChain.chainId,
      );
      if (!chainExists) {
        await CustomChainService.addChain({
          ...defaultCustomChain,
          user: zeroAddress,
        });
        await CustomChainService.addChain({
          ...defaultCustomMainnet,
          user: zeroAddress,
        });
      }
    };
    initDefaultChains();
  }, []);

  return (
    <SelectedChainContext.Provider
      value={{
        loading,
        selectedChain,
        setSelectedChain,
        selectedParentChain,
      }}
    >
      {children}
    </SelectedChainContext.Provider>
  );
}
