import { createContext, useState, ReactNode, useEffect } from "react";
import { CustomChain } from "@/types";
import { defaultCustomChild, defaultCustomMainnet } from "@/lib/wagmi-config";
import {
  getArbitrumNetworks,
  registerCustomArbitrumNetwork,
} from "@arbitrum/sdk";
import CustomChainService from "@/services/custom-chain-service";
import { arbitrum, arbitrumSepolia } from "viem/chains";
import { useAccount } from "wagmi";
import { useChains } from "@/hooks/use-chains";
import { FILTERS } from "@/constants";

type SelectedChainContextType = {
  loading: boolean;
  selectedChain: CustomChain;
  selectedParentChain: CustomChain;
  setSelectedChain: React.Dispatch<React.SetStateAction<CustomChain>>;
  customChains: CustomChain[];
  setCustomChains: React.Dispatch<React.SetStateAction<CustomChain[]>>;
};

export const SelectedChainContext = createContext<
  SelectedChainContextType | undefined
>(undefined);

export function SelectedChainProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [selectedChain, setSelectedChain] =
    useState<CustomChain>(defaultCustomChild);
  const [selectedParentChain, setSelectedParentChain] =
    useState<CustomChain>(defaultCustomMainnet);
  const { address } = useAccount();
  const [customChains, setCustomChains] = useState<CustomChain[]>([]);
  const { getChainById, isLoading: chainsLoading } = useChains();

  useEffect(() => {
    if (!address) return;
    const initializeCustomChains = async () => {
      const userChains = await CustomChainService.getUserChains(address);

      if (!userChains.some((x) => x.chainId === selectedChain.chainId))
        setSelectedChain(defaultCustomChild);

      const filteredUserChains = userChains.filter((x) =>
        CustomChainService.filterChain(x as CustomChain, FILTERS.ALL, "")
      );

      setCustomChains(filteredUserChains as CustomChain[]);
    };

    const lastAddress = localStorage.getItem("last-wallet-address");

    if (address !== lastAddress) {
      localStorage.setItem("last-wallet-address", address);
      window.location.reload();
    }

    initializeCustomChains();
  }, [address, selectedChain.chainId]);

  useEffect(() => {
    const getParent = () => {
      if (!selectedChain) return;
      setLoading(true);
      if (chainsLoading) return;

      const parentChain = getChainById(selectedChain.parentChainId);

      if (!parentChain) return;

      setSelectedParentChain(parentChain);
      setLoading(false);
    };
    getParent();
  }, [selectedChain, chainsLoading, getChainById]);

  useEffect(() => {
    if (
      !chainsLoading &&
      selectedChain &&
      selectedChain.chainId !== arbitrumSepolia.id &&
      selectedChain.chainId !== arbitrum.id &&
      !getArbitrumNetworks().some((x) => x.chainId === selectedChain.chainId)
    ) {
      const arbNetwork = {
        ...selectedChain,
        isCustom: true,
      };
      registerCustomArbitrumNetwork(arbNetwork, {
        throwIfAlreadyRegistered: false,
      });
    }
  }, [selectedChain, chainsLoading]);

  if (chainsLoading) return;

  return (
    <SelectedChainContext.Provider
      value={{
        loading,
        selectedChain,
        setSelectedChain,
        selectedParentChain,
        customChains,
        setCustomChains,
      }}
    >
      {children}
    </SelectedChainContext.Provider>
  );
}
