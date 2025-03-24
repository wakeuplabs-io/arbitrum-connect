import { createContext, useState, ReactNode, useEffect } from "react";
import { CustomChain } from "@/types";
import {
  customArbitrum,
  customArbitrumSepolia,
  customMainnet,
  customSepolia,
  defaultCustomChild,
  defaultCustomMainnet,
} from "@/lib/wagmi-config";
import {
  getArbitrumNetworks,
  registerCustomArbitrumNetwork,
} from "@arbitrum/sdk";
import CustomChainService from "@/services/custom-chain-service";
import { arbitrum, arbitrumSepolia } from "viem/chains";
import { useAccount } from "wagmi";
import { FILTERS } from "@/constants";
import { Address } from "viem";
import { useChains } from "@/hooks/use-chains";

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
  const { chains } = useChains();

  const initializeCustomChains = async (address: Address) => {
    const userChains = await CustomChainService.getUserChains(
      address,
      "",
      FILTERS.ALL
    );
    if (!userChains.some((x) => x.chainId === customArbitrum.chainId)) {
      const defaultChain = { ...customArbitrum, user: address };
      userChains.push({ ...defaultChain, user: address } as any);
      await CustomChainService.addChain(defaultChain);
    }
    if (!userChains.some((x) => x.chainId === customMainnet.chainId)) {
      const defaultChain = { ...customMainnet, user: address };
      await CustomChainService.addChain(defaultChain);
    }
    if (!userChains.some((x) => x.chainId === customSepolia.chainId)) {
      const defaultChain = { ...customSepolia, user: address };
      await CustomChainService.addChain(defaultChain);
    }
    if (!userChains.some((x) => x.chainId === customArbitrumSepolia.chainId)) {
      const defaultChain = { ...customArbitrumSepolia, user: address };
      userChains.push({ ...defaultChain, user: address } as any);
      await CustomChainService.addChain(defaultChain);
    }

    if (!userChains.some((x) => x.chainId === selectedChain.chainId))
      setSelectedChain(defaultCustomChild);

    setCustomChains(userChains as CustomChain[]);
  };

  useEffect(() => {
    if (!address) return;
    initializeCustomChains(address);
  }, [address]);

  useEffect(() => {
    const getParent = async () => {
      if (!selectedChain) return;

      setLoading(true);
      let parentChain = await CustomChainService.getChainById(
        selectedChain.parentChainId
      );
      if (!parentChain)
        parentChain = chains.filter(
          (x) => x.chainId === selectedChain.parentChainId
        )[0] as any;
      if (!parentChain) return;

      setSelectedParentChain(parentChain as any);
      setLoading(false);
    };
    getParent();
  }, [selectedChain?.parentChainId]);

  useEffect(() => {
    if (
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
  }, [selectedChain?.chainId]);

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
