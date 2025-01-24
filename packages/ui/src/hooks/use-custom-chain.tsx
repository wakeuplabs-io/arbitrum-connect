import { useState } from "react";
import { CreateChainPayload, CustomChain } from "@/types";
import { Address } from "viem";
import { FILTERS } from "@/constants";
import CustomChainService from "@/services/custom-chain-service";
import {
  getArbitrumNetworks,
  registerCustomArbitrumNetwork,
} from "@arbitrum/sdk";
import { arbitrum, arbitrumSepolia } from "viem/chains";

const getAllChains = () => {
  const allChains = CustomChainService.getAllChains();
  const arbNetworks = getArbitrumNetworks();
  allChains
    .filter((x) => !arbNetworks.some((y) => y.chainId === x.chainId))
    .forEach((chain) => {
      if (
        chain.chainId !== arbitrumSepolia.id &&
        chain.chainId !== arbitrum.id
      ) {
        const arbNetwork = {
          ...chain,
          isCustom: true,
        };
        registerCustomArbitrumNetwork(arbNetwork, {
          throwIfAlreadyRegistered: false,
        });
      }
    });

  return allChains;
};

export function useCustomChain() {
  const [chains, setChains] = useState<CustomChain[]>(getAllChains());
  const [loading, setLoading] = useState(false);

  const createChain = (chain: CreateChainPayload) => {
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
    setChains(filteredChains);
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

  const editChain = async (chain: CustomChain) => {
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
    chains,
    loading,
    createChain,
    deleteChain,
    getUserChains,
    getChainById,
    editChain
  };
}
