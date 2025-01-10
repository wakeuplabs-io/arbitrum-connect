import { createContext, useState, ReactNode, useEffect } from "react";
import { CustomChain } from "@/types";
import { Address, zeroAddress } from "viem";
import { defaultCustomChain, defaultCustomMainnet } from "@/lib/wagmi-config";
import { FILTERS } from "@/constants";

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
