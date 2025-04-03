import { useState } from "react";
import { CustomChain, CustomChainPayload, NetworkFilter } from "@/types";
import { Address } from "viem";
import { FILTERS } from "@/constants";
import CustomChainService from "@/services/custom-chain-service";
import { useChains } from "./use-chains";
import { useSelectedChain } from "./use-selected-chain";

export function useCustomChain() {
  const { setChains } = useChains();
  const { customChains, setCustomChains } = useSelectedChain();
  const [loading, setLoading] = useState(false);
  const [publicChains, setPublicChains] = useState<CustomChain[]>([]);

  const createChain = async (chain: CustomChainPayload) => {
    setLoading(true);
    const newChain = await CustomChainService.createChain(chain);
    setChains((currentChains) => {
      return [...currentChains, newChain];
    });
    setCustomChains((currentChains) => {
      return [...currentChains, newChain];
    });
    setLoading(false);
    return newChain;
  };

  const deleteChain = async (userAddress: Address, chainId: number) => {
    setLoading(true);
    const newChains = await CustomChainService.deleteChain(
      userAddress,
      chainId
    );
    setChains(newChains as CustomChain[]);
    setCustomChains(newChains as CustomChain[]);
  };

  const getUserChains = async (
    userAddress: Address,
    search: string = "",
    filter: FILTERS,
    testnetFilter?: NetworkFilter
  ) => {
    setLoading(true);
    const filteredChains = await CustomChainService.getUserChains(
      userAddress,
      search,
      filter,
      testnetFilter
    );
    setCustomChains(filteredChains as CustomChain[]);
    setLoading(false);
  };

  const getFilteredPublicChains = async (
    search: string = "",
    filter: FILTERS,
    testnetFilter?: NetworkFilter
  ) => {
    setLoading(true);
  
    const allChains = await CustomChainService.getAllChains();
  
    const filteredChains = allChains.filter((chain) =>
      CustomChainService.filterChain(chain as CustomChain, filter, search, testnetFilter)
    );
    setPublicChains(filteredChains as CustomChain[]);
    setLoading(false);
  };

  const editChain = async (chain: CustomChainPayload) => {
    setLoading(true);
    const editedChain = await CustomChainService.editChain(chain);
    setChains((currentChains) => {
      return currentChains.map((c) => {
        if (c.chainId === editedChain.chainId) {
          return editedChain;
        }
        return c;
      });
    });
    setCustomChains((currentChains) => {
      return currentChains.map((c) => {
        if (c.chainId === editedChain.chainId && c.user === chain.user) {
          return editedChain;
        }
        return c;
      });
    });
    setLoading(false);
    return editedChain;
  };

  const featureChain = async (userAddress: Address, chainId: number) => {
    setLoading(true);
    const chain = await CustomChainService.featureChain(chainId, userAddress);

    setCustomChains((currentChains) => {
      return currentChains.map((c) => {
        if (c.chainId === chain.chainId && c.user === userAddress) {
          return chain as CustomChain;
        }
        return c;
      });
    });
    setLoading(false);
  };

  return {
    customChains,
    publicChains,
    loading,
    createChain,
    deleteChain,
    getUserChains,
    getFilteredPublicChains,
    editChain,
    setCustomChains,
    featureChain,
  };
}
