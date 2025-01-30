import { createContext, useState, ReactNode, useEffect } from "react";
import { CustomChain } from "@/types";
import { defaultCustomChain, defaultCustomMainnet } from "@/lib/wagmi-config";
import {
  getArbitrumNetworks,
  registerCustomArbitrumNetwork,
} from "@arbitrum/sdk";
import CustomChainService from "@/services/custom-chain-service";
import { zeroAddress } from "viem";
import { arbitrum, arbitrumSepolia } from "viem/chains";

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

  useEffect(() => {
    const getParent = async () => {
      if (selectedChain?.parentChainId) {
        setLoading(true);
        const parentChain = await CustomChainService.getChainById(selectedChain?.parentChainId);
        if (parentChain) setSelectedParentChain(parentChain);
      }
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

  useEffect(() => {
    const initDefaultChains = async () => {
      const childChainExists = CustomChainService.getChainById(
        defaultCustomChain.chainId,
      );
      const parentChainExists = CustomChainService.getChainById(
        defaultCustomChain.chainId,
      );
      if (!childChainExists)
        CustomChainService.addChain({
          ...defaultCustomChain,
          user: zeroAddress,
        });
      if (!parentChainExists)
        CustomChainService.addChain({
          ...defaultCustomMainnet,
          user: zeroAddress,
        });
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
