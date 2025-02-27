import { useState } from "react";
import { CustomChainPayload } from "@/types";
import { Address } from "viem";
import { FILTERS } from "@/constants";
import CustomChainService from "@/services/custom-chain-service";
import { useChains } from "./use-chains";
import { useSelectedChain } from "./use-selected-chain";

export function useCustomChain() {
  const { setChains } = useChains();
  const { customChains, setCustomChains } = useSelectedChain();
  const [loading, setLoading] = useState(false);

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
      chainId,
    );
    setChains(newChains);
    setCustomChains(newChains);
  };

  const getUserChains = async (
    userAddress: Address,
    search: string = "",
    filter: FILTERS,
  ) => {
    setLoading(true);
    const filteredChains = await CustomChainService.getUserChains(
      userAddress,
      search,
      filter,
    );
    setCustomChains(filteredChains);
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
    let chain = await CustomChainService.featureChain(userAddress, chainId);

    setCustomChains((currentChains) => {
      return currentChains.map((c) => {
        if (c.chainId === chain.chainId && c.user === userAddress) {
          return chain;
        }
        return c;
      });
    });
    setLoading(false);
  };

  return {
    customChains,
    loading,
    createChain,
    deleteChain,
    getUserChains,
    editChain,
    setCustomChains,
    featureChain,
  };
}
