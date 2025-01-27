import { useState } from "react";
import { CustomChainPayload, CustomChain } from "@/types";
import { Address } from "viem";
import { FILTERS } from "@/constants";
import CustomChainService from "@/services/custom-chain-service";
import { useChains } from "./use-chains";

export function useCustomChain() {
  const { chains, setChains } = useChains();
  const [customChains, setCustomChains] = useState(chains);
  const [loading, setLoading] = useState(false);

  const createChain = (chain: CustomChainPayload) => {
    setLoading(true);
    const newChain = CustomChainService.createChain(chain);
    setChains((currentChains) => {
      return [...currentChains, newChain];
    });
    setLoading(false);
    return newChain;
  };

  const deleteChain = (userAddress: Address, chainId: number) => {
    setLoading(true);
    const chains = CustomChainService.deleteChain(userAddress, chainId);
    setChains(chains || []);
  };

  const getUserChains = (
    userAddress: Address,
    search: string = "",
    filter: FILTERS,
  ) => {
    setLoading(true);
    const filteredChains = CustomChainService.getUserChains(
      userAddress,
      search,
      filter,
    );
    setCustomChains(filteredChains);
    setLoading(false);
  };

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
    setLoading(false);
    return editedChain;
  };
  return {
    customChains,
    loading,
    createChain,
    deleteChain,
    getUserChains,
    getChainById,
    editChain,
    setCustomChains,
  };
}
