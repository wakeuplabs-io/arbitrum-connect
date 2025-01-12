import { useState } from "react";
import { CreateChainPayload, CustomChain } from "@/types";
import { Address } from "viem";
import { FILTERS } from "@/constants";
import CustomChainService from "@/services/custom-chain-service";

export function useCustomChain() {
  const [chains, setChains] = useState<CustomChain[]>([]);
  const [loading, setLoading] = useState(false);

  

  const createChain = async (chain: CreateChainPayload) => {
    setLoading(true);
    const newChain = await CustomChainService.createChain(chain);
    setChains((currentChains) => {
      return [...currentChains, newChain];
    });
    setLoading(false);
  };

  const deleteChain = async (userAddress: Address, chainId: number) => {
    setLoading(true);
    const chains = await CustomChainService.deleteChain(userAddress, chainId);
    setChains(chains || []);
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
    setChains(filteredChains);
    setLoading(false);
  };

  const getAllChains = async () => {
    setLoading(true);
    const chains = await CustomChainService.getAllChains();
    setChains(chains);
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

  return {
    chains,
    loading,
    createChain,
    deleteChain,
    getUserChains,
    getAllChains,
    getChainById,
  };
}
